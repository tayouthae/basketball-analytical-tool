# src/data_collection/barttorvik_scraper.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
from datetime import datetime
from tqdm import tqdm
import logging

class BartTorvik:
    def __init__(self, delay=1.0, browser_path=None, headless=False):
        self.base_url = "https://barttorvik.com"
        self.delay = delay
        self.headless = headless
        self.browser_path = browser_path
        self.driver = None
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        self._setup_driver()
        
    def _ensure_unique_columns(self, headers):
        unique_headers = []
        seen = set()
        
        for i, header in enumerate(headers):
            clean_header = header.strip() if header else ""
            
            if not clean_header:
                clean_header = f"Column_{i+1}"
            
            original_header = clean_header
            counter = 1
            while clean_header in seen:
                clean_header = f"{original_header}_{counter}"
                counter += 1
            
            seen.add(clean_header)
            unique_headers.append(clean_header)
        
        return unique_headers
        
    def _setup_driver(self):
        try:
            chrome_options = ChromeOptions()
            
            if self.headless:
                chrome_options.add_argument("--headless")
            
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            if self.browser_path:
                chrome_options.binary_location = self.browser_path
            else:
                brave_paths = [
                    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
                    "/usr/bin/brave-browser",
                    "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
                ]
                
                for path in brave_paths:
                    if os.path.exists(path):
                        chrome_options.binary_location = path
                        self.logger.info(f"Using Brave browser at: {path}")
                        break
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            
        except Exception as e:
            self.logger.error(f"Failed to setup driver: {e}")
            raise
    
    def _get_page_source(self, url):
        try:
            self.driver.get(url)
            
            WebDriverWait(self.driver, 30).until(
                lambda driver: "Verifying your browser" not in driver.page_source
            )
            
            time.sleep(2)
            
            return self.driver.page_source
            
        except Exception as e:
            self.logger.error(f"Failed to get page source for {url}: {e}")
            return None
    
    def _is_visible(self, tag):
        style = tag.get('style', '')
        return 'display: none' not in style.lower()
    
    def _parse_headers(self, table, filter_hidden=False):
        headers = []
        thead = table.find('thead')
        if not thead:
            return headers
        
        header_rows = thead.find_all('tr')
        
        if len(header_rows) == 1:
            for th in header_rows[0].find_all(['th', 'td']):
                if not filter_hidden or self._is_visible(th):
                    headers.append(th.text.strip())
        elif len(header_rows) == 2:
            row1_expanded = []
            row2_headers = []
            
            for th in header_rows[0].find_all(['th', 'td']):
                if not filter_hidden or self._is_visible(th):
                    # Extract text before <br> if it exists (for team rankings toprow)
                    if th.find('br'):
                        text_before_br = ""
                        for content in th.contents:
                            if content.name == 'br':
                                break
                            if hasattr(content, 'strip'):
                                text_before_br += content.strip()
                            else:
                                text_before_br += str(content).strip()
                        text = text_before_br
                    else:
                        text = th.text.strip()
                    
                    colspan = int(th.get('colspan', 1))
                    for _ in range(colspan):
                        row1_expanded.append(text)
            
            for th in header_rows[1].find_all(['th', 'td']):
                if not filter_hidden or self._is_visible(th):
                    row2_headers.append(th.text.strip())
            
            max_len = max(len(row1_expanded), len(row2_headers))
            row1_expanded.extend([''] * (max_len - len(row1_expanded)))
            row2_headers.extend([''] * (max_len - len(row2_headers)))
            
            for r1, r2 in zip(row1_expanded, row2_headers):
                if r1 and r2:
                    headers.append(f"{r1} - {r2}")
                elif r1:
                    headers.append(r1)
                elif r2:
                    headers.append(r2)
                else:
                    headers.append("")
        
        return headers
    
    def _parse_table_data(self, table, filter_hidden=False):
        rows = []
        tbody = table.find('tbody')
        
        if not tbody:
            tbody = table
        
        for row in tbody.find_all('tr'):
            cells = row.find_all(['td', 'th'])
            if not cells:
                continue
                
            row_data = []
            for cell in cells:
                if not filter_hidden or self._is_visible(cell):
                    link = cell.find('a')
                    if link:
                        cell_text = link.text.strip()
                    else:
                        br_tag = cell.find('br')
                        if br_tag:
                            text_before_br = ""
                            for content in cell.contents:
                                if content.name == 'br':
                                    break
                                if hasattr(content, 'strip'):
                                    text_before_br += content.strip()
                                else:
                                    text_before_br += str(content).strip()
                            cell_text = text_before_br
                        else:
                            cell_text = cell.get_text(strip=True)
                    
                    row_data.append(cell_text)
            
            if row_data and any(cell.strip() for cell in row_data):
                rows.append(row_data)
        
        return rows
    
    def _create_dataframe(self, headers, rows, year):
        if not rows:
            return None
        
        max_cols = max(len(row) for row in rows)
        
        if len(headers) < max_cols:
            for i in range(len(headers), max_cols):
                headers.append(f"Column_{i+1}")
        elif len(headers) > max_cols:
            headers = headers[:max_cols]
        
        headers = self._ensure_unique_columns(headers)
        
        normalized_rows = []
        for row in rows:
            if len(row) > max_cols:
                normalized_rows.append(row[:max_cols])
            elif len(row) < max_cols:
                padded_row = row + [''] * (max_cols - len(row))
                normalized_rows.append(padded_row)
            else:
                normalized_rows.append(row)
        
        df = pd.DataFrame(normalized_rows, columns=headers)
        df['Year'] = year
        return df

    def get_team_rankings(self, year=2024):
        url = f"{self.base_url}/trank.php?year={year}"
        page_source = self._get_page_source(url)
        
        if not page_source:
            return None
            
        soup = BeautifulSoup(page_source, 'html.parser')
        
        table = soup.find('table')
        if not table:
            self.logger.error(f"Could not find rankings table for year {year}")
            return None
        
        headers = self._parse_headers(table)
        rows = self._parse_table_data(table)
        
        self.logger.info(f"Team rankings {year}: Found {len(headers)} headers: {headers[:5]}...")
        self.logger.info(f"Team rankings {year}: Found {len(rows)} data rows")
        if rows:
            self.logger.info(f"Team rankings {year}: First row: {rows[0][:5]}...")
            self.logger.info(f"Team rankings {year}: Last row: {rows[-1][:5]}...")
        
        df = self._create_dataframe(headers, rows, year)
        if df is not None:
            time.sleep(self.delay)
        
        return df
    
    def get_team_stats(self, year=2024):
        url = f"{self.base_url}/teamstats.php?year={year}"
        page_source = self._get_page_source(url)
        
        if not page_source:
            return None
            
        soup = BeautifulSoup(page_source, 'html.parser')
        
        table = soup.find('table')
        if not table:
            self.logger.error(f"Could not find team stats table for year {year}")
            return None
        
        headers = self._parse_headers(table)
        rows = self._parse_table_data(table)
        
        df = self._create_dataframe(headers, rows, year)
        if df is not None:
            time.sleep(self.delay)
        
        return df

    def get_player_stats(self, year=2024):
        url = f"{self.base_url}/playerstat.php?link=y&year={year}"
        
        try:
            self.driver.get(url)
            
            WebDriverWait(self.driver, 30).until(
                lambda driver: "Verifying your browser" not in driver.page_source
            )
            
            WebDriverWait(self.driver, 20).until(
                lambda driver: driver.find_elements(By.CSS_SELECTOR, 'table[style*="white-space:nowrap;margin:auto;table-layout:fixed"]')
            )
            
            time.sleep(3)
            
            page_source = self.driver.page_source
            
        except Exception as e:
            self.logger.error(f"Failed to load player stats page for year {year}: {e}")
            return None
            
        soup = BeautifulSoup(page_source, 'html.parser')
        
        tables = soup.find_all('table')
        table = None
        
        self.logger.info(f"Found {len(tables)} tables for player stats year {year}")
        
        for i, tbl in enumerate(tables):
            tbl_str = str(tbl)
            self.logger.info(f"Table {i+1}: {tbl_str[:200]}...")
            
            table_tag = tbl_str.split('>')[0] + '>'
            
            if ('white-space:nowrap' in table_tag and 
                'margin:auto' in table_tag and 
                'table-layout:fixed' in table_tag and
                'display:none' not in table_tag and 
                'display: none' not in table_tag):
                table = tbl
                self.logger.info(f"Selected table {i+1} for player stats")
                break
        
        if not table and tables:
            self.logger.warning(f"Could not find table with expected style, using first available table")
            table = tables[0]
        
        if not table:
            self.logger.error(f"Could not find any suitable players table for year {year}")
            return None
        
        headers = self._parse_headers(table, filter_hidden=True)
        rows = self._parse_table_data(table, filter_hidden=True)
        
        df = self._create_dataframe(headers, rows, year)
        if df is not None:
            time.sleep(self.delay)
        
        return df
    
    def collect_historical_data(self, start_year=2019, end_year=2024):
        all_team_rankings = []
        all_team_stats = []
        all_player_data = []
        
        for year in tqdm(range(start_year, end_year + 1), desc="Collecting data"):
            self.logger.info(f"Collecting data for year {year}")
            
            team_rankings = self.get_team_rankings(year)
            if team_rankings is not None:
                all_team_rankings.append(team_rankings)
            
            team_stats = self.get_team_stats(year)
            if team_stats is not None:
                all_team_stats.append(team_stats)
            
            player_data = self.get_player_stats(year)
            if player_data is not None:
                all_player_data.append(player_data)
            
            time.sleep(2)
        
        team_rankings_df = pd.concat(all_team_rankings, ignore_index=True) if all_team_rankings else pd.DataFrame()
        team_stats_df = pd.concat(all_team_stats, ignore_index=True) if all_team_stats else pd.DataFrame()
        players_df = pd.concat(all_player_data, ignore_index=True) if all_player_data else pd.DataFrame()
        
        return team_rankings_df, team_stats_df, players_df
    
    def save_data(self, team_rankings_df, team_stats_df, players_df, data_dir="data/raw"):
        os.makedirs(data_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        team_rankings_file = f"{data_dir}/team_rankings_barttorvik_{timestamp}.csv"
        team_stats_file = f"{data_dir}/team_stats_barttorvik_{timestamp}.csv"
        players_file = f"{data_dir}/players_barttorvik_{timestamp}.csv"
        
        team_rankings_df.to_csv(team_rankings_file, index=False)
        team_stats_df.to_csv(team_stats_file, index=False)
        players_df.to_csv(players_file, index=False)
        
        self.logger.info(f"Data saved to:")
        self.logger.info(f"  Team Rankings: {team_rankings_file}")
        self.logger.info(f"  Team Stats: {team_stats_file}")
        self.logger.info(f"  Players: {players_file}")
        
        return team_rankings_file, team_stats_file, players_file
    
    def close(self):
        if self.driver:
            self.driver.quit()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

if __name__ == "__main__":
    with BartTorvik(delay=1.0, headless=False) as scraper:
        print("Testing data collection from barttorvik.com...")
        
        team_rankings_df, team_stats_df, players_df = scraper.collect_historical_data(2019, 2024)
        
        print(f"Collected {len(team_rankings_df)} team ranking records")
        print(f"Collected {len(team_stats_df)} team stats records") 
        print(f"Collected {len(players_df)} player records")
        
        team_rankings_file, team_stats_file, players_file = scraper.save_data(team_rankings_df, team_stats_df, players_df)
        
        print(f"Data collection complete!")
        print(f"Team Rankings: {team_rankings_file}")
        print(f"Team Stats: {team_stats_file}")
        print(f"Players: {players_file}")