// 한글 ↔ 영어 검색어 사전
// 문서에는 "Docker"라고 적혀 있어도 "도커"로 검색하면 찾을 수 있게,
// 반대로 "정규화"처럼 한글로만 적힌 개념은 "normalization"으로도 찾을 수 있게 한다.
// 한 줄 = 같은 뜻의 단어 묶음 (소문자, 띄어쓰기 없이)

const GROUPS: string[][] = [
  // Git / 협업
  ['git', '깃'],
  ['github', '깃허브', '깃헙'],
  ['gitlab', '깃랩'],
  ['commit', '커밋'],
  ['merge', '머지', '병합'],
  ['branch', '브랜치'],
  ['rebase', '리베이스'],
  ['squash', '스쿼시'],
  ['fork', '포크'],
  ['push', '푸시'],
  ['pull', '풀'],
  ['pr', 'pull', '풀리퀘스트', '풀리퀘', '피알'],
  ['checkout', '체크아웃'],
  ['reset', '리셋'],
  ['revert', '리버트', '되돌리기'],
  ['reflog', '리플로그'],
  ['stash', '스태시', '임시저장'],
  ['cherry-pick', 'cherrypick', '체리픽'],
  ['fetch', '페치'],
  ['tag', '태그'],
  ['gitignore', '깃이그노어'],
  ['origin', '오리진'],
  ['upstream', '업스트림'],
  ['head', '헤드'],
  ['blame', '블레임'],
  ['staging', 'stage', '스테이징'],
  ['conflict', '충돌', '컨플릭트'],
  ['review', '리뷰'],
  ['release', '릴리스', '릴리즈'],
  ['version', 'versioning', '버전'],
  ['repository', 'repo', '저장소', '레포', '리포', '리포지토리', '레포지토리'],
  ['lint', 'linting', '린트', '린팅'],
  ['formatter', '포매터', '포맷터'],
  ['actions', '액션'],
  ['codeowners', '코드오너'],
  ['convention', '컨벤션'],

  // 클라우드 / 인프라
  ['docker', '도커'],
  ['dockerfile', '도커파일'],
  ['container', '컨테이너'],
  ['image', '이미지'],
  ['hub', '허브'],
  ['aws', '아마존'],
  ['cloud', '클라우드'],
  ['server', '서버'],
  ['vpc'],
  ['subnet', '서브넷'],
  ['nginx', '엔진엑스'],
  ['iam'],
  ['infrastructure', '인프라'],
  ['gemini', '제미나이'],
  ['openai', '오픈에이아이'],
  ['claude', '클로드'],
  ['gpt', '지피티'],

  // 운영체제 / 리눅스
  ['linux', '리눅스'],
  ['ubuntu', '우분투'],
  ['bash', '배시'],
  ['shell', '쉘', '셸'],
  ['cron', 'crontab', '크론'],
  ['firewall', 'ufw', '방화벽'],
  ['port', '포트'],
  ['network', '네트워크'],
  ['ssh'],
  ['permission', '권한'],
  ['acl'],
  ['process', '프로세스'],
  ['thread', '스레드', '쓰레드'],
  ['deadlock', '데드락', '교착'],
  ['memory', '메모리'],
  ['leak', '누수', '릭'],
  ['cpu', '씨피유'],
  ['signal', '시그널'],
  ['sigkill', '시그킬'],
  ['oom'],
  ['garbage', 'gc', '가비지'],
  ['log', 'logs', '로그'],
  ['env', 'environment', '환경변수', '환경'],
  ['profiling', 'profiler', '프로파일링', '프로파일러'],
  ['socket', '소켓'],

  // 자료구조 / 알고리즘
  ['redis', '레디스'],
  ['cache', '캐시', '캐쉬'],
  ['hash', '해시', '해쉬'],
  ['hashmap', '해시맵'],
  ['heap', '힙'],
  ['stack', '스택'],
  ['queue', '큐'],
  ['linkedlist', '연결리스트'],
  ['lru'],
  ['ttl', '만료'],
  ['graph', '그래프'],
  ['dag'],
  ['bfs', '너비우선'],
  ['dfs', '깊이우선'],
  ['sort', 'sorting', '정렬'],
  ['bubble', '버블', '거품'],
  ['selection', '셀렉션', '선택'],
  ['insertion', '인서션', '삽입'],
  ['quick', '퀵'],
  ['radix', '래딕스', '기수'],
  ['counting', '카운팅', '계수'],
  ['pivot', '피벗', '피봇'],
  ['stable', '안정', '안정정렬'],
  ['binary', '바이너리', '이분', '이진'],
  ['search', '서치', '탐색'],
  ['collision', '충돌'],
  ['dijkstra', '다익스트라', '데이크스트라'],
  ['lca', '공통조상', '최소공통조상'],
  ['topological', '위상'],
  ['dp', 'dynamic', '동적', '다이나믹', '디피'],
  ['memoization', '메모이제이션'],
  ['lis', '최장'],
  ['bitmask', '비트마스크'],
  ['bit', '비트'],
  ['recursion', '재귀'],
  ['algorithm', '알고리즘'],
  ['complexity', '복잡도'],
  ['index', '인덱스', '색인'],

  // 데이터베이스
  ['database', 'db', '데이터베이스', '디비'],
  ['sql', '에스큐엘'],
  ['join', '조인'],
  ['normalization', '정규화'],
  ['transaction', '트랜잭션'],
  ['pk', 'primary', '기본키', '프라이머리'],
  ['fk', 'foreign', '외래키'],
  ['null', '널'],
  ['unique', '유니크'],
  ['schema', '스키마'],
  ['relation', '릴레이션'],
  ['entity', '엔터티', '엔티티'],
  ['erd'],
  ['table', '테이블'],
  ['rollback', '롤백'],
  ['isolation', '격리', '격리수준'],
  ['concurrency', '동시성'],
  ['phantom', '팬텀', '유령'],
  ['dirty', '더티'],
  ['tuple', '튜플'],
  ['attribute', '애트리뷰트', '속성'],
  ['domain', '도메인'],
  ['cardinality', '카디널리티'],
  ['identifier', '식별자'],

  // 웹 / 프론트엔드
  ['css'],
  ['html'],
  ['javascript', 'js', '자바스크립트'],
  ['flexbox', 'flex', '플렉스박스', '플렉스'],
  ['grid', '그리드'],
  ['padding', '패딩'],
  ['margin', '마진'],
  ['border', '보더', '테두리'],
  ['selector', 'selectors', '선택자', '셀렉터'],
  ['responsive', '반응형'],
  ['dark', '다크'],
  ['theme', '테마'],
  ['api', '에이피아이'],
  ['addeventlistener', 'event', '이벤트'],
  ['state', '상태'],
  ['animation', '애니메이션'],
  ['scroll', '스크롤'],

  // 파이썬
  ['python', '파이썬'],
  ['class', '클래스'],
  ['object', 'instance', '객체', '인스턴스'],
  ['variable', '변수'],
  ['function', 'def', '함수'],
  ['if', 'elif', 'condition', '조건문', '조건'],
  ['for', 'while', 'loop', '반복문', '반복'],
  ['list', '리스트'],
  ['dict', 'dictionary', '딕셔너리'],
  ['str', 'string', '문자열'],
  ['int', 'integer', '정수'],
  ['bool', 'boolean', '불린'],
  ['slicing', '슬라이싱'],
  ['indexing', '인덱싱'],
  ['self', '셀프'],
  ['module', '모듈'],
  ['generator', 'yield', '제너레이터'],
  ['decorator', '데코레이터'],
  ['dataclass', '데이터클래스'],
  ['argparse'],
  ['json', 'jsonl', '제이슨'],
  ['csv'],
  ['cli'],
  ['repl'],
  ['parsing', 'parser', '파싱', '파서'],
]

// 단어 → 같은 뜻 묶음
const LOOKUP = new Map<string, string[]>()
for (const group of GROUPS) {
  for (const w of group) LOOKUP.set(w, [...new Set([...(LOOKUP.get(w) ?? []), ...group])])
}
const KOREAN_WORDS = [...LOOKUP.keys()].filter((w) => /[가-힣]/.test(w)).sort((a, b) => b.length - a.length)

// 한국어 조사/어미 (긴 것부터) - "도커란", "정규화의", "스레드와" 같은 입력을 위해
const PARTICLES = ['이란', '으로', '에서', '에게', '까지', '부터', '이랑', '란', '은', '는', '이', '가', '을', '를', '의', '에', '와', '과', '로', '도', '만', '랑']

const hasKorean = (s: string) => /[가-힣]/.test(s)

function stripParticle(word: string): string | null {
  if (!hasKorean(word)) return null
  for (const p of PARTICLES) {
    if (word.length > p.length + 1 && word.endsWith(p)) return word.slice(0, -p.length)
  }
  return null
}

// 검색어 한 단어를 같은 뜻 단어들로 넓힌다 (원래 단어가 맨 앞)
export function expandToken(raw: string): string[] {
  const word = raw.toLowerCase()
  const out = new Set<string>([word])
  const stripped = stripParticle(word)
  if (stripped) out.add(stripped)

  for (const w of [...out]) {
    LOOKUP.get(w)?.forEach((x) => out.add(x))
  }
  if (hasKorean(word)) {
    // 사전 단어 뒤에 조사가 붙은 경우 (예: 레디스는, 해시맵이란)
    const head = KOREAN_WORDS.find((k) => word.startsWith(k) && k.length >= 2)
    if (head) LOOKUP.get(head)!.forEach((x) => out.add(x))
    // 입력 중인 앞부분 (예: "레디" → 레디스)
    if (word.length >= 2 && !head) {
      const partial = KOREAN_WORDS.find((k) => k.startsWith(word))
      if (partial) LOOKUP.get(partial)!.forEach((x) => out.add(x))
    }
  }
  return [...out]
}
