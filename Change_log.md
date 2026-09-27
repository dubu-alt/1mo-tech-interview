# Change Log

1mo.dev 사이트의 변경 내역을 정리한 문서입니다. 최신 변경이 위에 옵니다.

## 2026-09-27 · 홈 3x3 목록과 하단 독 내비게이션

### 왜 바꿨나
기존 홈에서는 "둘러보기" 버튼을 눌러 첫 글로 들어간 뒤 사이드바를 펼쳐야만 다른 분류로 이동할 수 있었습니다.
홈에서 원하는 주제로 바로 들어가고, 글을 읽는 중에도 다른 분류로 쉽게 옮겨 갈 수 있도록 내비게이션을 개편했습니다.

### 추가
- **홈 3x3 카테고리 목록** (`docs/.vitepress/theme/components/CategoryGrid.vue`)
  - 9개 분류: 웹 기능 구현 / CSS / Python / 운영체제·Linux / 자료구조 / 데이터베이스 / 알고리즘 / Git 협업 / Cloud
  - 카드를 누르면 해당 분류의 첫 문서로 바로 이동
  - 분류별 문서 개수와 첫 문서 링크는 `config.mts`의 sidebar에서 자동 계산 (문서를 추가해도 목록을 따로 고칠 필요 없음)
  - 모바일에서도 3열을 유지하고, 아이콘 · 제목 · 문서 개수만 보이는 컴팩트 카드로 표시
- **하단 독(Dock) 내비게이션** (`docs/.vitepress/theme/components/Dock.vue`)
  - 21st.dev의 [Dock](https://21st.dev/@anurag-mishra22/components/dock-two) (MIT) 디자인을 참고해 Vue + CSS로 옮김
  - 홈 / Web / Language / CS / Algorithm / Cloud 이동, 검색(⌘K 창 열기), 다크 모드 전환
  - 둥실 떠 있는 애니메이션, 호버 시 커지며 올라가는 아이콘과 라벨 툴팁, 현재 분류는 점으로 표시
  - 터치 기기에서는 호버 효과 대신 눌림 효과만 적용, 모바일에서는 8개 버튼이 한 줄에 들어가도록 축소
  - 움직임 줄이기 설정(`prefers-reduced-motion`) 사용 시 애니메이션 끔, 인쇄 시 숨김
- **카테고리 정의 공용 파일** (`docs/.vitepress/theme/categories.ts`)
  - 홈 목록과 독이 같은 분류 정의를 공유
- **커스텀 테마 진입점** (`docs/.vitepress/theme/index.ts`, `custom.css`)
  - 기본 테마를 확장해 홈 히어로 아래에 목록, 모든 페이지 하단에 독을 삽입
  - 독에 본문과 사이드바 끝부분이 가려지지 않도록 하단 여백 추가

### 변경
- 홈(`docs/index.md`)의 기존 소개 카드 5칸(`features`)을 3x3 목록으로 대체
- "둘러보기" 버튼이 첫 문서 대신 홈의 목록(`#categories`)으로 스크롤하도록 변경

## 2026-09-27 · Notion 개인 노트 기반 개념 문서 추가
- Redis 문서 보강, Docker(Cloud) · CSS 기초(Web) · DB 이론(Computer Science) · Git 협업(Algorithm) 문서 추가
- 사이드바와 홈 소개 문구 갱신

## 2026-09-27 · 사이트 초기 배포
- VitePress 기반 1mo.dev 사이트 공개 (Web / Language / Computer Science / Algorithm / Cloud)
- GitHub Actions로 `main` 푸시 시 GitHub Pages 자동 배포
