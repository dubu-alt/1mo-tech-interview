---
title: "한눈에 보는 GitHub 협업"
---

| 개념 | 한 줄 요약 |
|---|---|
| Pull Request | 내 작업을 검토받고 머지해 달라고 요청하는 GitHub 기능 |
| PR 상태 (Open/Merged/Closed) | 검토 중 / 병합 완료 / 반려·종료 |
| Merge Commit | 두 브랜치 이력을 그대로 보존하며 병합 커밋 하나 추가 |
| Squash and Merge | 여러 커밋을 하나로 압축해서 병합, 히스토리가 깔끔해짐 |
| Rebase and Merge | 커밋을 target 위로 재배치해 선형 히스토리로 병합 |
| Fork | 원격 저장소를 내 계정으로 통째로 복사, 오픈소스 기여의 기본 |
| Merge 충돌 | 같은 파일의 같은 부분을 다르게 고쳤을 때 발생, 마커를 직접 수정해서 해결 |
| 충돌 최소화 | 최신 코드 자주 당겨오기 + 작은 PR/파일 + 활발한 커뮤니케이션 |
| Default Branch | PR이 기본으로 머지되는 대상 브랜치 (보통 `main`) |
| Branch Protection Rules | 이름 패턴 기반으로 특정 브랜치에 PR 필수, 선형 히스토리 등을 강제 |
| 코드 리뷰 | 라인/멀티라인 코멘트, Viewed 체크, Comment/Approve/Request changes로 진행 |
| Conventional Commit | `<type>(<scope>): <subject>` 형식으로 커밋 메시지 규칙화, 자동 문서화 가능 |
| Linting / Formatter | 코드 스타일을 자동 검사(Linting)하고 자동 교정(Formatter) |
| GitHub Flow | `main`을 항상 배포 가능하게 유지, feature 브랜치 + PR로 단순하게 운영 |
| Git Flow / GitLab Flow / Trunk Based | 복잡한 버전 관리(Git Flow), CI/CD 특화 환경 분리(GitLab Flow), 극단적으로 빠른 통합(Trunk Based) |
| Semantic Versioning | `MAJOR.MINOR.PATCH`로 변경의 크기와 호환성을 버전 번호에 담는 방식 |
| CODEOWNERS / PR 템플릿 | `.github` 디렉토리로 리뷰어 자동 지정, PR 작성 양식 통일 |
| GitHub Actions CI | `.github/workflows`의 YAML로 코드 스타일 검사·테스트를 자동 실행, 필수 체크로 지정하면 머지 조건으로도 사용 가능 |
