---
title: "IPC (Inter-Process Communication)"
sidebar: "IPC (Inter-Process Communication)"
---

IPC (Inter Process Communication) is **the set of methods the operating system (kernel) provides so that independent processes can exchange data with each other**. They include pipes, message queues, shared memory, memory maps and sockets.

## At a Glance

- Processes run **independently**. Each has its own memory space, so it is not affected by other processes. (Threads, on the other hand, share resources inside one process and do affect each other. See [Processes and Threads](/en/cs/os/02-프로세스와-스레드))
- But sometimes even independent processes **need to cooperate**. For example, when you type `ls | grep txt` in a terminal, the output of the `ls` process has to be handed over as the input of the `grep` process. IPC is what makes this possible.
- Processes cannot touch each other's memory directly, so they communicate using **the IPC facilities provided by the kernel**.
  - Kernel: the core part of the operating system, which provides many basic services to every other part. (See [What Is an Operating System](/en/cs/os/07-운영체제란))
- Analogy: processes are **neighbors who each live in a different house**. They cannot enter each other's homes, so they communicate using methods set up by the management office (kernel), such as a one-way mailbox (pipe), a building bulletin board (message queue), a shared storage room (shared memory) and a telephone (socket).
- There are several kinds of IPC facilities, and you have to pick the one that fits the situation.

```text
 ┌───────────────┐                        ┌───────────────┐
 │  Process A     │                        │  Process B     │
 │ (own memory)   │                        │ (own memory)   │
 └───────┬───────┘                        └───────▲───────┘
         │  ① send                    ② receive   │
 ════════▼════════════════════════════════════════╪════════
 │                 Kernel (IPC facilities)                 │
 │   pipes · message queues · shared memory · sockets ...  │
 ══════════════════════════════════════════════════════════
```

Knowing three terms for communication direction first makes the rest easier.

| Term | Meaning | Analogy |
|------|----|------|
| Simplex | One side only sends, the other only receives | A radio broadcast |
| Half-duplex | Both sides can send, but only one at a time | A walkie-talkie ("Over") |
| Full-duplex | Both sides send and receive at the same time | A phone call |

The examples are written in Python, and the results were checked by running them on macOS.

## 1. Anonymous Pipe

- A pipe is a channel that connects two processes. **One process can only write data, and the other can only read it.**
- In other words, it is **simplex communication that flows in one direction only**. So if you want to exchange data in both directions, you need to create **2** pipes.
- Because it has no name, it can be used only between processes that **clearly know each other**, such as the process that created the pipe and the child it created with `fork` (a parent-child relationship). (See [System Calls](/en/cs/os/09-시스템-콜))
- Pros: very simple to use. When data flows simply in one direction, a pipe is efficient.
- Cons: when you need two pipes for two-way communication, the implementation gets complicated.
- The `|` in `ls | grep txt` in a terminal is exactly an anonymous pipe.

The picture below shows three programs connected with pipes in a shell. The previous program's output (stdout) flows through the pipe in one direction only, into the next program's input (stdin). Error output (stderr) does not go through the pipe and goes straight to the screen.

![A flow where keyboard input passes through Program 1, 2 and 3 in turn via pipes and is printed to the screen](/images/os/ipc-pipeline.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pipeline.svg) (XcepticZP, public domain)*

```python
import os

r, w = os.pipe()              # two ends are created: the read end (r) and the write end (w)

rc = os.fork()
if rc == 0:                   # child: only writes
    os.close(r)
    os.write(w, "Hi, parent".encode())
    os.close(w)
    os._exit(0)
else:                         # parent: only reads
    os.close(w)
    data = os.read(r, 1024).decode()
    os.close(r)
    os.wait()
    print(f"Message the parent received: {data}")
```

Output:

```text
Message the parent received: Hi, parent
```

## 2. Named Pipe (FIFO)

- An anonymous pipe is used when **you clearly know who you are communicating with**, as with parent and child.
- A named pipe is used for communication **between processes that know nothing about each other**. It extends the anonymous pipe so that **other processes unrelated to the parent process can communicate too.**
- For communication, a **special named file** is created in the file system, and any process that knows its path can open it to write or read. Data put in first comes out first, so it is also called a FIFO (First In, First Out).
- But a named pipe also flows **in one direction only**. For two-way communication, you need to create 2 of them, just like with anonymous pipes.

```python
import os, tempfile

path = os.path.join(tempfile.mkdtemp(), "mailbox")
os.mkfifo(path)               # create a 'named pipe' in the file system

if os.fork() == 0:            # sending side (any process just needs to know this path)
    with open(path, "w") as f:
        f.write("A message that found its way by name")
    os._exit(0)
else:                         # receiving side
    with open(path) as f:
        print(f"Received message: {f.read()}")
    os.wait()
    os.remove(path)
```

Output:

```text
Received message: A message that found its way by name
```

The example uses `fork` for convenience, but if you open two terminals and open the same path from different programs, they communicate in exactly the same way.

## 3. Message Queue

- Like a pipe, one side puts data in and the other takes it out, but where a pipe is **a continuous stream of bytes**, a message queue is **a message storage space (memory)** inside the kernel.
- Data is put in and taken out **one message at a time**, so one message sent is received as exactly one message. (A pipe has no boundaries, so data sent in two writes can be read stuck together in one read.)
- Each message can be given **a number (type)**, so the receiver can pick out only the messages with the number it wants. This makes it easy for several processes to handle data at the same time.
- Analogy: it is like pinning notes with a heading such as "[Order] Americano" on a building bulletin board, so whoever needs them takes only the notes meant for them.

```python
from multiprocessing import Process, Queue

def worker(q):
    q.put(("order", "Americano"))
    q.put(("order", "Latte"))
    q.put(("end", None))

if __name__ == "__main__":
    q = Queue()
    p = Process(target=worker, args=(q,))
    p.start()
    while True:
        kind, item = q.get()          # taken out in the order put in, one message at a time
        if kind == "end":
            break
        print(f"{kind}: {item}")
    p.join()
```

Output:

```text
order: Americano
order: Latte
```

> Python's `multiprocessing.Queue` does not use the operating system's message queue directly; internally, it implements message-by-message exchange on top of a pipe. Treat it as an example that shows the concept of putting in and taking out messages one at a time.

## 4. Shared Memory

- If pipes and message queues are facilities for **sending and receiving (communicating)** data, shared memory is a facility that lets processes **use the data itself together**.
- Normally a process's memory region is independent and must always be protected from access by other processes. But there are also situations where data needs to be shared with other processes. You could send data through a pipe, but it would be more convenient if processes could share memory the way threads do.
- Shared memory **allows several processes to use the same memory region together**.
  1. One process asks the kernel for shared memory.
  2. The kernel creates the memory space.
  3. From then on, the permitted processes read and write that region directly, as if it were their own memory.
- **Because it accesses memory directly without an intermediary (the kernel), it is the fastest form of IPC.** There is no need to copy data to send it.
- In exchange, if several processes modify the same spot at the same time, the values can get tangled, so **you have to take care of synchronization yourself**. (See [Race Conditions](/en/cs/os/12-경쟁-상태))

```python
from multiprocessing import Process, Value

def worker(counter):
    with counter.get_lock():      # lock so they don't modify it at the same time
        counter.value += 100      # modify the same memory directly, without copying

if __name__ == "__main__":
    counter = Value("i", 0)       # one integer that several processes see together
    workers = [Process(target=worker, args=(counter,)) for _ in range(3)]
    for p in workers:
        p.start()
    for p in workers:
        p.join()
    print(f"Final value: {counter.value}")
```

Output:

```text
Final value: 300
```

Three processes each added 100, and because they all modified **the same memory**, the parent sees 300. Compare this with a variable copied by `fork`, where the parent's side stayed the same even after the child changed it (see [System Calls](/en/cs/os/09-시스템-콜)). The reason for locking with `get_lock()` is explained in the "Synchronization" part below.

## 5. Memory-Mapped File

- Like shared memory, it shares memory. The difference is that it **connects (maps) an open file to memory and shares that**. In other words, the shared medium is **file + memory**.
- When the memory is modified, the change is reflected in the file too, and other processes that mapped the same file also see the change.
- It is mainly used when **large data stored in a file needs to be shared**. Instead of reading and writing the file piece by piece, you can handle it like memory, which is convenient and fast.

```python
import mmap, os, tempfile

path = os.path.join(tempfile.mkdtemp(), "shared.bin")
with open(path, "wb") as f:
    f.write(b"before")

with open(path, "r+b") as f:
    mm = mmap.mmap(f.fileno(), 0)     # mirror the file contents directly into memory

    if os.fork() == 0:
        mm[:6] = b"after!"            # when the child modifies the memory
        mm.flush()
        os._exit(0)
    os.wait()
    print(f"Read from memory: {mm[:6].decode()}")

with open(path, "rb") as f:
    print(f"Read from file:   {f.read().decode()}")   # reflected in the file too
```

Output:

```text
Read from memory: after!
Read from file:   after!
```

The child modified the memory, and the change shows up both in the parent's memory and in the file on disk.

## 6. Socket

- Data is exchanged through **network socket communication**. It is exactly the way a web browser and a web server communicate.
- It is a structure where **a client and a server** communicate through sockets, and data can be exchanged **even with processes on other (remote) computers**. Processes on the same computer can use it too (Unix domain sockets).
- A single connection supports **full-duplex communication, where both sides send and receive at the same time**.
- The functions used by the server and client are as follows.

| Side | Order | What it does |
|----|------|---------|
| Server | `socket` → `bind` | Creates a socket and attaches an address (IP, port) |
| Server | `listen` | Gets ready to receive connection requests |
| Server | `accept` | Accepts an incoming connection request |
| Client | `socket` → `connect` | Creates a socket and requests a connection to the server |
| Both | `send` / `recv` | Send and receive data |

Below is a pair of already-connected sockets (`socketpair`), showing a message sent and a reply received over a single connection.

```python
import os, socket

parent_sock, child_sock = socket.socketpair()   # a pair of sockets connected to each other

if os.fork() == 0:
    parent_sock.close()
    msg = child_sock.recv(1024).decode()
    child_sock.sendall(f"Got '{msg}' loud and clear".encode())   # reply over the same socket
    os._exit(0)
else:
    child_sock.close()
    parent_sock.sendall("Hello".encode())
    print(parent_sock.recv(1024).decode())
    os.wait()
```

Output:

```text
Got 'Hello' loud and clear
```

Unlike a pipe, one socket handled both sending and receiving.

## Comparing the Methods

| Method | Direction | Who can communicate | Characteristics |
|------|------|-----------|------|
| Anonymous pipe | Simplex | Related processes, such as parent and child | The simplest. Needs 2 for two-way |
| Named pipe | Simplex | Any process that knows the path | Found by file name |
| Message queue | Simplex (per queue) | Several processes | Message by message, pick by number |
| Shared memory | Two-way | Permitted processes | The fastest. You must handle synchronization yourself |
| Memory map | Two-way | Processes that opened the same file | Good for sharing large files |
| Socket | Full-duplex | Same computer or remote | Can communicate across a network |

## IPC and Synchronization

When several processes use the same resource (shared memory, a file, etc.) together, values can get tangled as they modify it at the same time. So to synchronize and protect data between processes in IPC, **semaphores and mutexes** are used. They are tools that let **only one process at a time** access a shared resource. The `get_lock()` in the shared memory example above plays exactly this role.

Details are covered in the [Race Conditions](/en/cs/os/12-경쟁-상태) and [Semaphores and Mutexes](/en/cs/os/13-세마포어와-뮤텍스) articles, and for the problems caused by misusing locks, see the [Deadlock](/en/cs/os/06-데드락) article.

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| IPC | How processes that cannot enter each other's homes communicate through the management office (kernel) |
| Anonymous pipe | A one-way mailbox between parent and child |
| Named pipe (FIFO) | A one-way mailbox anyone can use if they know the address (file name) |
| Message queue | A bulletin board where you pin notes with headings and pick out the ones you need |
| Shared memory | A storage room shared by several households. The fastest, but you need to agree on turns |
| Memory map | Mirroring a file into memory so everyone sees it together. Good for sharing big files |
| Socket | A telephone for two-way, simultaneous conversation, even with faraway computers |
| Semaphore / Mutex | A key that lets only one person at a time into a shared resource |
