import time
import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.driver_cache import DriverCacheManager

def get_bithumb_themes_and_coins():
    # 브라우저 설정
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")

    # 드라이버 초기화 (로컬 경로에 설치하여 권한 문제 방지)
    try:
        # webdriver_manager 4.x 방식
        cache_manager = DriverCacheManager(root_dir="./.wdm")
        driver_manager = ChromeDriverManager(cache_manager=cache_manager)
        driver_path = driver_manager.install()
        
        try:
            os.chmod(driver_path, 0o755)
        except:
            pass
        driver = webdriver.Chrome(service=Service(driver_path), options=chrome_options)
    except Exception as e:
        print(f"Driver initialization failed: {e}")
        # Fallback: try default install if custom path fails (though likely to fail if permissions are issue)
        try:
            print("Retrying with default path...")
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        except Exception as e2:
            print(f"Default driver initialization also failed: {e2}")
            return

    result_data = {}

    try:
        url = "https://www.bithumb.com/react/"
        print(f"Connecting to {url}...")
        driver.get(url)

        # '테마' 탭 클릭
        theme_tab_xpath = '//*[@id="coinList"]/div[1]/div[1]/div/div[1]/div/div/div/div[8]/button'
        wait = WebDriverWait(driver, 15)
        theme_tab = wait.until(EC.element_to_be_clickable((By.XPATH, theme_tab_xpath)))
        print("Clicking '테마' tab...")
        theme_tab.click()
        time.sleep(2)

        processed_themes = set()
        
        # 제외할 키워드 (네비게이션 버튼 등)
        nav_keywords = ["이전", "다음"]

        while True:
            # 현재 보이는 테마 버튼들 수집
            buttons = driver.find_elements(By.CSS_SELECTOR, "div[role='tablist'] button")
            
            current_page_themes = []
            next_btn = None
            
            for btn in buttons:
                txt = btn.text.strip()
                if not txt: continue
                
                if txt == "다음":
                    next_btn = btn
                elif txt not in nav_keywords:
                    current_page_themes.append(txt)

            # 현재 페이지의 테마들 순회
            for theme_name in current_page_themes:
                if theme_name in processed_themes:
                    continue
                
                print(f"Processing theme: {theme_name}")
                
                try:
                    # 해당 테마 버튼 다시 찾기
                    btn_xpath = f"//div[@role='tablist']//button[contains(text(), '{theme_name}')]"
                    btn_element = driver.find_element(By.XPATH, btn_xpath)
                    
                    btn_element.click()
                    time.sleep(1) # 테이블 로딩 대기
                    
                    # 코인 리스트 추출
                    coin_rows = driver.find_elements(By.CSS_SELECTOR, "#coinList table tbody tr")
                    
                    coins = []
                    for row in coin_rows:
                        try:
                            # 코인명/심볼 추출
                            name_col = row.find_element(By.CSS_SELECTOR, "td:nth-child(1)")
                            
                            lines = name_col.text.strip().split('\n')
                            if len(lines) >= 2:
                                k_name = lines[0]
                                symbol = lines[1]
                                coins.append({"name": k_name, "symbol": symbol})
                            elif len(lines) == 1:
                                coins.append({"name": lines[0], "symbol": ""})
                        except:
                            continue
                    
                    result_data[theme_name] = coins
                    print(f"  - Found {len(coins)} coins")
                    processed_themes.add(theme_name)
                    
                except Exception as e:
                    print(f"  - Failed to click or scrape {theme_name}: {e}")

            # '다음' 버튼 처리
            buttons = driver.find_elements(By.CSS_SELECTOR, "div[role='tablist'] button")
            next_btn = None
            for btn in buttons:
                if btn.text.strip() == "다음":
                    next_btn = btn
                    break

            if next_btn:
                try:
                    if next_btn.is_enabled():
                        print("Clicking 'Next' button...")
                        next_btn.click()
                        time.sleep(2) # 슬라이드 애니메이션 대기
                        
                        # 새로운 테마 목록 확인
                        new_buttons = driver.find_elements(By.CSS_SELECTOR, "div[role='tablist'] button")
                        new_theme_names = [b.text.strip() for b in new_buttons if b.text.strip() not in nav_keywords]
                        
                        if all(name in processed_themes for name in new_theme_names):
                            print("No new themes found. Finishing.")
                            break
                    else:
                        print("'Next' button disabled. Finishing.")
                        break
                except Exception as e:
                    print(f"Error clicking next: {e}")
                    break
            else:
                print("No 'Next' button found. Finishing.")
                break

    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        driver.quit()
        
        # JSON 저장
        with open('bithumb_themes.json', 'w', encoding='utf-8') as f:
            json.dump(result_data, f, ensure_ascii=False, indent=2)
        print("Saved data to bithumb_themes.json")

if __name__ == "__main__":
    print("Starting script...")
    get_bithumb_themes_and_coins()
