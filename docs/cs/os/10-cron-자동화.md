---
title: "cron 자동화"
---

### 개념

cron은 정해진 시간에 명령어나 스크립트를 자동 실행하는 스케줄러다.

### crontab 편집

```bash
# agent-admin 계정으로 crontab 편집
crontab -e

# 등록
* * * * * /home/agent-admin/agent-app/bin/monitor.sh

# 확인
crontab -l
```

### 시간 표현 형식

```
*  *  *  *  *  실행할명령어
|  |  |  |  |
|  |  |  |  +-- 요일 (0=일요일, 6=토요일)
|  |  |  +----- 월 (1-12)
|  |  +-------- 일 (1-31)
|  +----------- 시 (0-23)
+-------------- 분 (0-59)

* = 매번 (모든 값)
```

| 표현 | 의미 |
| --- | --- |
| `* * * * *` | 매분 실행 |
| `0 * * * *` | 매 정시 실행 |
| `0 9 * * 1` | 매주 월요일 9시 실행 |

---


> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)