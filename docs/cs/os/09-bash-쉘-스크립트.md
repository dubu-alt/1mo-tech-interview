# Bash 쉘 스크립트

### 기본 구조

```bash
#!/bin/bash
# 첫 줄은 항상 인터프리터 선언 (shebang)

# 변수
NAME="agent"
echo "Hello,$NAME"

# 조건문
if [ -z "$PID" ]; then
    echo "프로세스 없음"
    exit 1
fi

# 명령어 결과를 변수에 저장
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
```

### monitor.sh에서 자주 쓰는 패턴

```bash
# 프로세스 PID 가져오기
PID=$(pgrep -f agent_app.py)

# 포트 LISTEN 확인
ss -tulnp | grep ":15034" > /dev/null 2>&1

# CPU 사용률
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# 메모리 사용률
MEM=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100}')

# 디스크 사용률
DISK=$(df / | tail -1 | awk '{print $5}' | tr -d '%')

# 로그 기록
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] PID:$PID CPU:${CPU}% MEM:${MEM}% DISK_USED:${DISK}%" >> /var/log/agent-app/monitor.log
```

### 종료 코드 규칙

| 코드 | 의미 |
| --- | --- |
| `exit 0` | 정상 종료 |
| `exit 1` | 오류 종료 |

스크립트가 `exit 1`로 끝나면 cron이나 다른 스크립트에서 실패로 감지할 수 있다.

---


> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)