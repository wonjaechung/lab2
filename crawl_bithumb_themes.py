import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def get_bithumb_themes():
    # 브라우저 설정 (헤드리스 모드로 실행 가능)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 창을 띄우지 않으려면 활성화
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")

    # 드라이버 초기화
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # 1. 빗썸 거래소 페이지 접속
        url = "https://www.bithumb.com/react/"
        print(f"Connecting to {url}...")
        driver.get(url)

        # 2. '테마' 버튼이 로드될 때까지 대기 및 클릭
        # 사용자께서 제공하신 XPath 활용
        theme_button_xpath = '//*[@id="coinList"]/div[1]/div[1]/div/div[1]/div/div/div/div[8]/button'
        
        wait = WebDriverWait(driver, 15)
        theme_button = wait.until(EC.element_to_be_clickable((By.XPATH, theme_button_xpath)))
        
        print("Clicking '테마' tab...")
        theme_button.click()
        
        # 3. 테마 목록이 나타날 때까지 잠시 대기
        time.sleep(2)

        # 4. 테마 리스트 추출
        # 보통 클릭 후 나타나는 하위 요소들이나 특정 클래스명을 가진 요소들을 찾습니다.
        # 여기서는 '테마' 탭 내부에 나열된 버튼이나 텍스트 요소들을 가져옵니다.
        # 테마 리스트가 포함된 컨테이너를 타겟팅합니다.
        themes = []
        
        # 테마 버튼들 (보통 테마 탭 클릭 시 하단에 가로로 나열되는 리스트)
        # 구조에 따라 적절한 CSS Selector나 XPath를 사용해야 합니다.
        # 아래는 일반적인 테마 아이템들이 들어있는 영역의 선택자 예시입니다.
        theme_items = driver.find_elements(By.CSS_SELECTOR, "div[role='tablist'] button")
        
        # 만약 전체 리스트가 별도의 영역에 나타난다면 해당 영역을 탐색
        for item in theme_items:
            text = item.text.strip()
            if text and text not in ["원화", "BTC", "관심", "신규", "인기", "테마"]: # 메인 탭 제외
                themes.append(text)

        if not themes:
            # 다른 구조일 경우 대비: 버튼 내부의 텍스트들을 모두 긁어옴
            # 테마 탭 하위의 div 구조 탐색
            list_container_xpath = '//*[@id="coinList"]/div[1]/div[1]/div/div[2]'
            list_items = driver.find_elements(By.XPATH, f"{list_container_xpath}//span")
            themes = [i.text for i in list_items if i.text]

        print(f"\nSuccessfully crawled {len(themes)} themes:")
        for idx, theme in enumerate(themes, 1):
            print(f"{idx}. {theme}")
            
        return themes

    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    get_bithumb_themes()
