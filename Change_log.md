# Change Log

1mo.dev 사이트의 변경 내역을 정리한 문서입니다. 최신 변경이 위에 옵니다.

## 2026-09-27 · Spotlight 스타일 검색창

### 왜 바꿨나
기본 검색창은 기능은 충분했지만 사이트의 독 디자인과 따로 노는 느낌이 있었습니다.
macOS Spotlight처럼 가볍게 열리고, 검색하지 않아도 분류로 바로 이동할 수 있는 검색창으로 바꿨습니다.

### 추가
- **Spotlight 검색창** (`docs/.vitepress/theme/components/Spotlight.vue`)
  - 21st.dev의 Apple Spotlight (React + framer-motion) 컴포넌트를 참고해 Vue + CSS로 옮김
  - 검색 데이터는 VitePress 기본 로컬 검색 인덱스(MiniSearch)를 그대로 사용해 검색 품질은 기존과 같음
  - 열릴 때 흐림 + 살짝 늘어났다 돌아오는 애니메이션, 안내 문구가 바뀔 때 위아래로 흐려지며 교체
  - 데스크톱: 검색창에 마우스를 올리면 5개 분류(Web / Language / CS / Algorithm / Cloud) 바로가기 버블이 끈적하게(gooey) 튀어나옴
  - 모바일: 검색어가 없을 때 분류 바로가기를 아이콘 줄로 표시, 입력창 17px로 iOS 자동 확대 방지, `취소` 버튼으로 닫기
  - 결과마다 분류 아이콘, 일치한 단어 강조, `세부 분류 › 상위 제목` 경로 표시
  - `⌘K` / `Ctrl+K` / `/` 로 열기, `↑` `↓` 이동, `Enter` 열기, `Esc` 또는 바깥 클릭으로 닫기, `⌘`/`Ctrl`+클릭은 새 탭
  - 열려 있는 동안 뒤 페이지 스크롤 잠금, 닫으면 원래 포커스로 복귀
- **상단 검색 버튼** (`docs/.vitepress/theme/components/NavSearch.vue`)
  - VitePress 기본 검색 버튼(`VPNavBarSearch`)을 `config.mts`의 vite alias로 교체
  - 데스크톱은 `검색 ⌘K` 알약 모양, 모바일은 아이콘만 표시
- **공용 파일**: 아이콘(`theme/icons.ts`), 검색창 열림 상태(`theme/spotlight.ts`)

### 변경
- 하단 독의 검색 버튼도 새 Spotlight 검색창을 열도록 변경
- 독 안에 있던 아이콘 정의를 `theme/icons.ts`로 옮겨 검색창과 함께 사용

## 2026-09-27 · 하단 독 자동 숨김과 접기

### 왜 바꿨나
독이 항상 화면 아래에 떠 있으면 글을 읽을 때 본문 끝부분을 가리거나 계속 눈에 걸려 불편할 수 있습니다.
읽는 흐름은 방해하지 않으면서, 필요할 때는 바로 꺼내 쓸 수 있도록 두 가지 방식을 함께 넣었습니다.

### 추가
- **스크롤 자동 숨김**: 아래로 스크롤하며 읽는 동안에는 독이 화면 아래로 숨고, 위로 조금만 스크롤하거나 페이지 맨 위/맨 끝에 오면 다시 나타남
  - 작은 흔들림에는 반응하지 않도록 6px 이상 움직였을 때만 방향으로 인정
  - 다른 페이지로 이동하면 다시 보이고, 키보드(Tab)로 독에 들어오면 숨기지 않음
- **접기 버튼**: 독 오른쪽 끝의 접기(⌄) 버튼을 누르면 오른쪽 아래 동그란 버튼 하나로 줄어들고, 누르면 다시 펼쳐짐
  - 접은 상태는 브라우저에 저장되어 다음 방문 때도 유지

### 수정
- 독이 늘 떠다니는 애니메이션 때문에 접기/펼치기 전환이 끝나지 않던 문제를 막기 위해 전환 기준을 `transition`으로 고정
- 버튼이 하나 늘어난 만큼 좁은 모바일 화면(400px, 350px 이하)에서 아이콘 크기를 한 단계 더 줄여 한 줄 유지

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
