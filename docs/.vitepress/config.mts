import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '1mo.dev',
  description: '신입 개발자 전공 지식 & 기술 면접 백과사전',
  lang: 'ko-KR',
  base: '/',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  vite: {
    resolve: {
      alias: [
        {
          // 기본 검색 버튼(VPNavBarSearch)을 Spotlight 검색 버튼으로 교체
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/NavSearch.vue', import.meta.url)),
        },
      ],
    },
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/dubu-alt/Codyssey-B1' },
    ],
    sidebar: [
  {
    "text": "📌 Web",
    "collapsed": true,
    "items": [
      {
        "text": "주요 기능",
        "collapsed": true,
        "items": [
          {
            "text": "반응형 레이아웃",
            "link": "/web/features/01-반응형-레이아웃"
          },
          {
            "text": "햄버거 메뉴",
            "link": "/web/features/02-햄버거-메뉴"
          },
          {
            "text": "다크 모드",
            "link": "/web/features/03-다크-모드"
          },
          {
            "text": "스크롤 탑 버튼 / 헤더 스타일 변경",
            "link": "/web/features/04-스크롤-탑-버튼-헤더-스타일-변경"
          },
          {
            "text": "부드러운 스크롤",
            "link": "/web/features/05-부드러운-스크롤"
          },
          {
            "text": "스크롤 애니메이션",
            "link": "/web/features/06-스크롤-애니메이션"
          },
          {
            "text": "Contact 폼 유효성 검사",
            "link": "/web/features/07-contact-폼-유효성-검사"
          },
          {
            "text": "GitHub API 연동 및 상태 관리",
            "link": "/web/features/08-github-api-연동-및-상태-관리"
          },
          {
            "text": "프로젝트 언어 필터링",
            "link": "/web/features/09-프로젝트-언어-필터링"
          },
          {
            "text": "Hero 타이핑 효과",
            "link": "/web/features/10-hero-타이핑-효과"
          }
        ]
      },
      {
        "text": "CSS 설계",
        "collapsed": true,
        "items": [
          {
            "text": "CSS 변수",
            "link": "/web/css/01-css-변수"
          },
          {
            "text": "Flexbox를 사용한 곳",
            "link": "/web/css/02-flexbox를-사용한-곳"
          },
          {
            "text": "Grid를 사용한 곳",
            "link": "/web/css/03-grid를-사용한-곳"
          },
          {
            "text": "그 외 설계 포인트",
            "link": "/web/css/04-그-외-설계-포인트"
          }
        ]
      },
      {
        "text": "CSS 기초",
        "collapsed": true,
        "items": [
          {
            "text": "CSS 규칙과 스타일-내용 분리",
            "link": "/web/css-basics/01-css-규칙과-스타일-분리"
          },
          {
            "text": "id와 class 선택자",
            "link": "/web/css-basics/02-id와-class-선택자"
          },
          {
            "text": "CSS 색상과 크기 단위",
            "link": "/web/css-basics/03-색상과-크기-단위"
          },
          {
            "text": "CSS 코멘트 달기",
            "link": "/web/css-basics/04-코멘트-달기"
          },
          {
            "text": "자주 쓰는 CSS 스타일 속성",
            "link": "/web/css-basics/05-자주-쓰는-스타일-속성"
          },
          {
            "text": "CSS 박스 모델",
            "link": "/web/css-basics/06-박스-모델"
          },
          {
            "text": "padding, margin과 마진 상쇄",
            "link": "/web/css-basics/07-padding-margin과-마진-상쇄"
          },
          {
            "text": "border, box-sizing, overflow",
            "link": "/web/css-basics/08-border-box-sizing-overflow"
          },
          {
            "text": "CSS 기초 개념 한 줄 요약",
            "link": "/web/css-basics/09-css-개념-한줄-요약"
          }
        ]
      },
      {
        "text": "JavaScript 설계",
        "collapsed": true,
        "items": [
          {
            "text": "`addEventListener`만 사용",
            "link": "/web/js/01-addeventlistener만-사용"
          },
          {
            "text": "상태(state) 중심 구조",
            "link": "/web/js/02-상태state-중심-구조"
          },
          {
            "text": "GitHub API 상태를 하나의 진실 공급원으로",
            "link": "/web/js/03-github-api-상태를-하나의-진실-공급원으로"
          },
          {
            "text": "비동기 에러 처리",
            "link": "/web/js/04-비동기-에러-처리"
          }
        ]
      }
    ]
  },
  {
    "text": "📌 Language",
    "collapsed": true,
    "items": [
      {
        "text": "콘솔 프로그램이란?",
        "link": "/language/python/01-콘솔-프로그램이란"
      },
      {
        "text": "CLI와 명령어 파싱 (argparse)",
        "link": "/language/python/02-cli와-명령어-파싱-argparse"
      },
      {
        "text": "dataclass - 데이터 담는 그릇",
        "link": "/language/python/03-dataclass-데이터-담는-그릇"
      },
      {
        "text": "클래스와 모듈화 - 코드를 나눠서 정리하기",
        "link": "/language/python/04-클래스와-모듈화-코드를-나눠서-정리하기"
      },
      {
        "text": "파일 입출력과 영구 저장",
        "link": "/language/python/05-파일-입출력과-영구-저장"
      },
      {
        "text": "JSONL과 CSV - 저장 파일 형식",
        "link": "/language/python/06-jsonl과-csv-저장-파일-형식"
      },
      {
        "text": "제너레이터(yield)와 스트리밍 처리",
        "link": "/language/python/07-제너레이터yield와-스트리밍-처리"
      },
      {
        "text": "데코레이터 - 공통 기능을 분리하는 포장지",
        "link": "/language/python/08-데코레이터-공통-기능을-분리하는-포장지"
      },
      {
        "text": "타입 힌트 - 함수의 설명서",
        "link": "/language/python/09-타입-힌트-함수의-설명서"
      },
      {
        "text": "예외 처리와 종료 코드",
        "link": "/language/python/10-예외-처리와-종료-코드"
      },
      {
        "text": "원자적 교체 - 안전하게 파일 고치기",
        "link": "/language/python/11-원자적-교체-안전하게-파일-고치기"
      },
      {
        "text": "한 줄 요약",
        "link": "/language/python/12-한-줄-요약"
      }
    ]
  },
  {
    "text": "📌 Computer Science",
    "collapsed": true,
    "items": [
      {
        "text": "Operating System",
        "collapsed": true,
        "items": [
          {
            "text": "파일 시스템과 디렉토리 구조",
            "link": "/cs/os/01-파일-시스템과-디렉토리-구조"
          },
          {
            "text": "사용자와 그룹 관리",
            "link": "/cs/os/02-사용자와-그룹-관리"
          },
          {
            "text": "파일 권한과 ACL",
            "link": "/cs/os/03-파일-권한과-acl"
          },
          {
            "text": "프로세스 관리 (PID)",
            "link": "/cs/os/04-프로세스-관리-pid"
          },
          {
            "text": "네트워크와 포트",
            "link": "/cs/os/05-네트워크와-포트"
          },
          {
            "text": "SSH 보안 설정",
            "link": "/cs/os/06-ssh-보안-설정"
          },
          {
            "text": "방화벽",
            "link": "/cs/os/07-방화벽"
          },
          {
            "text": "환경 변수",
            "link": "/cs/os/08-환경-변수"
          },
          {
            "text": "Bash 쉘 스크립트",
            "link": "/cs/os/09-bash-쉘-스크립트"
          },
          {
            "text": "cron 자동화",
            "link": "/cs/os/10-cron-자동화"
          },
          {
            "text": "로그 관리",
            "link": "/cs/os/11-로그-관리"
          },
          {
            "text": "개념 간 연결 흐름 요약",
            "link": "/cs/os/12-개념-간-연결-흐름-요약"
          },
          {
            "text": "메모리 구조 (프로세스 메모리 레이아웃)",
            "link": "/cs/os/13-메모리-구조-프로세스-메모리-레이아웃"
          },
          {
            "text": "💧 메모리 누수 (Memory Leak)",
            "link": "/cs/os/14-💧-메모리-누수-memory-leak"
          },
          {
            "text": "OOM (Out of Memory)",
            "link": "/cs/os/15-oom-out-of-memory"
          },
          {
            "text": "프로세스 & 스레드 (Process & Thread)",
            "link": "/cs/os/16-프로세스-&-스레드-process-&-thread"
          },
          {
            "text": "데드락 (Deadlock)",
            "link": "/cs/os/17-데드락-deadlock"
          },
          {
            "text": "선형 증가 패턴 분석",
            "link": "/cs/os/18-선형-증가-패턴-분석"
          },
          {
            "text": "시그널 (Signal) - SIGKILL",
            "link": "/cs/os/19-시그널-signal-sigkill"
          },
          {
            "text": "가비지 컬렉션 (Garbage Collection)",
            "link": "/cs/os/20-가비지-컬렉션-garbage-collection"
          },
          {
            "text": "메모리 프로파일링 도구",
            "link": "/cs/os/21-메모리-프로파일링-도구"
          },
          {
            "text": "전체 개념 연결 지도",
            "link": "/cs/os/22-전체-개념-연결-지도"
          },
          {
            "text": "번 (CPU 분석) - 필수 개념",
            "link": "/cs/os/23-번-cpu-분석-필수-개념"
          },
          {
            "text": "번 (Deadlock 분석) - 필수 개념",
            "link": "/cs/os/24-번-deadlock-분석-필수-개념"
          },
          {
            "text": "비교: CPU vs Deadlock",
            "link": "/cs/os/25-비교-cpu-vs-deadlock"
          },
          {
            "text": "여러 개념들",
            "link": "/cs/os/26-여러-개념들"
          },
          {
            "text": "학습 팁",
            "link": "/cs/os/27-학습-팁"
          },
          {
            "text": "요약",
            "link": "/cs/os/28-요약"
          }
        ]
      },
      {
        "text": "Data Structure",
        "collapsed": true,
        "items": [
          {
            "text": "Redis란? 그리고 왜 만들어보나?",
            "link": "/cs/data-structure/01-redis란-그리고-왜-만들어보나"
          },
          {
            "text": "시간 복잡도 O(1), O(log n) - \"빠르다\"의 기준",
            "link": "/cs/data-structure/02-시간-복잡도-o1-olog-n-빠르다의-기준"
          },
          {
            "text": "이중 연결 리스트 - 앞뒤로 연결된 줄",
            "link": "/cs/data-structure/03-이중-연결-리스트-앞뒤로-연결된-줄"
          },
          {
            "text": "해시맵 - 이름표로 바로 찾는 창고",
            "link": "/cs/data-structure/04-해시맵-이름표로-바로-찾는-창고"
          },
          {
            "text": "최소 힙 - 제일 급한 것부터 꺼내는 구조",
            "link": "/cs/data-structure/05-최소-힙-제일-급한-것부터-꺼내는-구조"
          },
          {
            "text": "LRU - 가장 오래 안 쓴 것부터 버리기",
            "link": "/cs/data-structure/06-lru-가장-오래-안-쓴-것부터-버리기"
          },
          {
            "text": "TTL - 데이터의 유통기한",
            "link": "/cs/data-structure/07-ttl-데이터의-유통기한"
          },
          {
            "text": "REPL - 대화형 프로그램 만들기",
            "link": "/cs/data-structure/08-repl-대화형-프로그램-만들기"
          },
          {
            "text": "한 줄 요약",
            "link": "/cs/data-structure/09-한-줄-요약"
          }
        ]
      },
      {
        "text": "Database",
        "collapsed": true,
        "items": [
          {
            "text": "테이블을 나눈 이유?",
            "link": "/cs/database/01-테이블을-나눈-이유"
          },
          {
            "text": "DB와 엑셀의 차이",
            "link": "/cs/database/02-db와-엑셀의-차이"
          },
          {
            "text": "부모 테이블과 자식 테이블",
            "link": "/cs/database/03-부모-테이블과-자식-테이블"
          },
          {
            "text": "참조(Reference)란",
            "link": "/cs/database/04-참조reference란"
          },
          {
            "text": "기본키(Primary Key, PK)",
            "link": "/cs/database/05-기본키primary-key-pk"
          },
          {
            "text": "외래키(Foreign Key, FK)",
            "link": "/cs/database/06-외래키foreign-key-fk"
          },
          {
            "text": "PK와 FK 비교",
            "link": "/cs/database/07-pk와-fk-비교"
          },
          {
            "text": "관계의 종류 (1:1 / 1:N / N:M)",
            "link": "/cs/database/08-관계의-종류-11-1n-nm"
          },
          {
            "text": "조인(JOIN)",
            "link": "/cs/database/09-조인join"
          },
          {
            "text": "참조 무결성(Referential Integrity)",
            "link": "/cs/database/10-참조-무결성referential-integrity"
          },
          {
            "text": "DDL / DML / DQL",
            "link": "/cs/database/11-ddl-dml-dql"
          },
          {
            "text": "NULL과 NOT NULL",
            "link": "/cs/database/12-null과-not-null"
          },
          {
            "text": "UNIQUE와 PRIMARY KEY의 차이",
            "link": "/cs/database/13-unique와-primary-key의-차이"
          },
          {
            "text": "인덱스란?",
            "link": "/cs/database/14-인덱스란"
          },
          {
            "text": "릴레이션이란? (튜플/애트리뷰트/도메인)",
            "link": "/cs/database/15-릴레이션과-기본-용어"
          },
          {
            "text": "스키마 3단계와 데이터 독립성",
            "link": "/cs/database/16-스키마와-데이터-독립성"
          },
          {
            "text": "엔터티 사이의 관계: 존재 관계 vs 행위 관계",
            "link": "/cs/database/17-엔터티와-관계"
          },
          {
            "text": "ERD 표기법: 까마귀발(Crow's Foot)",
            "link": "/cs/database/18-erd-표기법"
          },
          {
            "text": "속성(Attribute)은 어떻게 나뉘나",
            "link": "/cs/database/19-속성의-분류"
          },
          {
            "text": "식별자의 종류: 주식별자, 보조식별자, 인조식별자",
            "link": "/cs/database/20-식별자의-종류"
          },
          {
            "text": "함수 종속성: X를 알면 Y를 알 수 있다",
            "link": "/cs/database/21-함수-종속성"
          },
          {
            "text": "정규화: 중복 데이터를 안 두는 기술",
            "link": "/cs/database/22-정규화"
          },
          {
            "text": "조인을 집합으로 보면: INNER vs OUTER",
            "link": "/cs/database/23-조인의-이론적-분류"
          }
        ]
      }
    ]
  },
  {
    "text": "📌 Algorithm",
    "collapsed": true,
    "items": [
      {
        "text": "Mini Git 구현",
        "collapsed": true,
        "items": [
      {
        "text": "Git과 커밋이란?",
        "link": "/algorithm/01-git과-커밋이란"
      },
      {
        "text": "그래프와 DAG - 왜 순환이 없어야 하나?",
        "link": "/algorithm/02-그래프와-dag-왜-순환이-없어야-하나"
      },
      {
        "text": "브랜치와 HEAD - \"지금 어디 작업 중?\" 표시판",
        "link": "/algorithm/03-브랜치와-head-지금-어디-작업-중-표시판"
      },
      {
        "text": "위상 정렬 - 부모가 먼저 나오는 로그",
        "link": "/algorithm/04-위상-정렬-부모가-먼저-나오는-로그"
      },
      {
        "text": "BFS(너비 우선 탐색) - 최단 경로 찾기",
        "link": "/algorithm/05-bfs너비-우선-탐색-최단-경로-찾기"
      },
      {
        "text": "DFS/집합 추적 - 조상 찾기",
        "link": "/algorithm/06-dfs집합-추적-조상-찾기"
      },
      {
        "text": "역색인(Inverted Index) - 책 뒤의 색인 페이지",
        "link": "/algorithm/07-역색인inverted-index-책-뒤의-색인-페이지"
      },
      {
        "text": "정렬 알고리즘 직접 구현하기 (merge sort)",
        "link": "/algorithm/08-정렬-알고리즘-직접-구현하기-merge-sort"
      },
      {
        "text": "REPL과 명령 파싱",
        "link": "/algorithm/09-repl과-명령-파싱"
      },
      {
        "text": "한 줄 요약",
        "link": "/algorithm/10-한-줄-요약"
      }
        ]
      },
      {
        "text": "Git 협업 (B2-2)",
        "collapsed": true,
        "items": [
          {
            "text": "Pull Request란?",
            "link": "/algorithm/git-collaboration/01-pull-request-개념"
          },
          {
            "text": "Merge 전략 3종 비교",
            "link": "/algorithm/git-collaboration/02-merge-전략-3종-비교"
          },
          {
            "text": "Fork와 오픈소스 기여",
            "link": "/algorithm/git-collaboration/03-fork와-오픈소스-기여"
          },
          {
            "text": "Merge 충돌, 해결과 예방",
            "link": "/algorithm/git-collaboration/04-merge-충돌-해결과-최소화"
          },
          {
            "text": "GitHub Repository 환경설정",
            "link": "/algorithm/git-collaboration/05-repository-환경설정"
          },
          {
            "text": "브랜치 보호 규칙",
            "link": "/algorithm/git-collaboration/06-브랜치-보호-규칙"
          },
          {
            "text": "GitHub로 코드 리뷰하기",
            "link": "/algorithm/git-collaboration/07-코드-리뷰-실전"
          },
          {
            "text": "Conventional Commit: 커밋 메시지 규칙",
            "link": "/algorithm/git-collaboration/08-커밋-메시지-컨벤션"
          },
          {
            "text": "Linting과 Formatter",
            "link": "/algorithm/git-collaboration/09-linting과-formatter"
          },
          {
            "text": "GitHub Flow",
            "link": "/algorithm/git-collaboration/10-github-flow"
          },
          {
            "text": "Git Flow vs GitHub Flow",
            "link": "/algorithm/git-collaboration/11-git-flow-vs-github-flow"
          },
          {
            "text": "버전 관리 전략: Semantic Versioning",
            "link": "/algorithm/git-collaboration/12-버전-관리-전략"
          },
          {
            "text": "협업 자동화: .github 디렉토리",
            "link": "/algorithm/git-collaboration/13-협업-자동화"
          },
          {
            "text": "GitHub Actions로 CI 구현하기",
            "link": "/algorithm/git-collaboration/14-github-actions-ci"
          },
          {
            "text": "한눈에 보는 GitHub 협업",
            "link": "/algorithm/git-collaboration/15-한눈에-보는-git-collaboration"
          }
        ]
      }
    ]
  },
  {
    "text": "📌 Cloud",
    "collapsed": true,
    "items": [
      {
        "text": "AWS 클라우드 인프라 구축 프로젝트",
        "link": "/cloud/01-aws-클라우드-인프라-구축"
      },
      {
        "text": "ai-gitgen — AI 기반 Git 커밋/PR 자동 생성기",
        "link": "/cloud/02-ai-gitgen"
      },
      {
        "text": "컨테이너와 이미지란?",
        "link": "/cloud/03-컨테이너와-이미지란"
      },
      {
        "text": "이미지 빌드와 Docker Hub 배포",
        "link": "/cloud/04-이미지-빌드와-도커허브-배포"
      },
      {
        "text": "docker exec와 docker attach 차이",
        "link": "/cloud/05-docker-exec와-attach-차이"
      }
    ]
  }
],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dubu-alt' }
    ],
    search: { provider: 'local' },
    outline: { label: '이 페이지 목차' },
    docFooter: { prev: '이전', next: '다음' },
    darkModeSwitchLabel: '다크 모드',
    returnToTopLabel: '맨 위로'
  }
})
