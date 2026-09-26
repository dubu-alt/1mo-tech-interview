# 프로세스 관리 (PID)

### 개념

프로세스는 실행 중인 프로그램이다. 각 프로세스에는 고유한 PID(Process ID) 번호가 부여된다.

### 주요 명령어

```bash
# 전체 프로세스 목록
ps aux

# 특정 프로세스 검색
ps aux | grep agent_app.py

# 프로세스 종료
kill <PID>
kill -9 <PID>    # 강제 종료

# 실시간 프로세스 모니터링
top
htop
```

### monitor.sh에서 활용하는 방법

```bash
PID=$(pgrep -f agent_app.py)

if [ -z "$PID" ]; then
    echo "[ERROR] 프로세스가 실행 중이지 않습니다."
    exit 1
fi
```

---


> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)