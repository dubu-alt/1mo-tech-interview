<script setup lang="ts">
// 상단 내비게이션의 관리자 버튼
// - 로그아웃 상태: 열쇠 버튼 → "GitHub로 로그인" (팝업) 또는 GitHub 토큰으로 로그인
// - 로그인 상태: 프로필 사진 버튼 → 관리자 페이지 열기, 로그아웃
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { adminUser, isAdmin, loadAdmin, login, loginWithGitHub, logout, watchAdmin } from '../admin'

const open = ref(false) // 로그인 창
const menu = ref(false) // 로그인 후 메뉴
const token = ref('')
const busy = ref(false)
const error = ref('')
const showToken = ref(false) // 토큰 로그인 칸 펼치기

onMounted(() => {
  loadAdmin()
  watchAdmin()
  document.addEventListener('click', closeMenu)
})
onBeforeUnmount(() => document.removeEventListener('click', closeMenu))

function closeMenu(e: MouseEvent) {
  if (!(e.target as HTMLElement)?.closest?.('.na-wrap')) menu.value = false
}

async function github() {
  busy.value = true
  error.value = ''
  try {
    await loginWithGitHub()
    open.value = false
  } catch (e: any) {
    error.value = e?.message || '로그인하지 못했어요.'
  } finally {
    busy.value = false
  }
}

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await login(token.value)
    token.value = ''
    open.value = false
  } catch (e: any) {
    error.value = e?.message || '로그인하지 못했어요.'
  } finally {
    busy.value = false
  }
}

function doLogout() {
  menu.value = false
  logout()
}
</script>

<template>
  <div class="na-wrap">
    <button
      v-if="!isAdmin"
      type="button"
      class="na-btn"
      aria-label="관리자 로그인"
      title="관리자 로그인"
      @click="open = true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
      </svg>
    </button>
    <button v-else type="button" class="na-btn" :title="`관리자: ${adminUser?.login}`" @click.stop="menu = !menu">
      <img v-if="adminUser?.avatarURL" :src="adminUser.avatarURL" alt="" class="na-avatar" />
      <span v-else class="na-dot">관리</span>
    </button>

    <div v-if="menu" class="na-menu">
      <div class="na-who">관리자 모드 · @{{ adminUser?.login }}</div>
      <a class="na-item" href="/admin/" target="_blank" rel="noopener">관리자 페이지 열기</a>
      <button type="button" class="na-item" @click="doLogout">로그아웃</button>
    </div>

    <Teleport to="body">
      <div v-if="open" class="na-overlay" @click.self="open = false">
        <form class="na-modal" @submit.prevent="submit">
          <h3>관리자 로그인</h3>
          <p>
            GitHub 계정으로 로그인하면 글을 페이지에서 바로 고치거나 새로 쓸 수 있어요.
            이 사이트 저장소에 쓰기 권한이 있는 계정만 관리자가 되고, 관리자 페이지(/admin)와 로그인이 함께 유지돼요.
          </p>
          <button type="button" class="na-github" :disabled="busy" @click="github">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            {{ busy ? 'GitHub 창에서 승인해 주세요…' : 'GitHub로 로그인' }}
          </button>
          <p v-if="error" class="na-error">{{ error }}</p>
          <button type="button" class="na-link" @click="showToken = !showToken">
            {{ showToken ? '토큰 로그인 닫기' : '토큰으로 로그인하기' }}
          </button>
          <template v-if="showToken">
            <input
              v-model="token"
              type="password"
              placeholder="github_pat_..."
              autocomplete="current-password"
            />
            <div class="na-actions">
              <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">토큰 관리</a>
              <span class="na-grow" />
              <button type="submit" class="na-primary" :disabled="busy">{{ busy ? '확인 중…' : '토큰으로 로그인' }}</button>
            </div>
          </template>
          <div class="na-actions na-close">
            <span class="na-grow" />
            <button type="button" class="na-ghost" @click="open = false">닫기</button>
          </div>
        </form>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.na-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
}
.na-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.na-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}
.na-btn svg {
  width: 18px;
  height: 18px;
}
.na-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}
.na-dot {
  font-size: 11px;
  color: var(--vp-c-brand-1);
}
.na-menu {
  position: absolute;
  top: 44px;
  right: 0;
  min-width: 200px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  z-index: 100;
}
.na-who {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.na-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.na-item:hover {
  background: var(--vp-c-default-soft);
}
.na-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
  z-index: 300;
}
.na-modal {
  width: min(440px, 100%);
  padding: 24px;
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-5);
}
.na-modal h3 {
  margin: 0 0 8px;
  font-size: 18px;
}
.na-modal p {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.na-github {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 11px 14px;
  border: 0;
  border-radius: 10px;
  background: #24292f;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.dark .na-github {
  background: #f0f0f3;
  color: #18181b;
}
.na-github:disabled {
  opacity: 0.7;
}
.na-github svg {
  width: 20px;
  height: 20px;
}
.na-link {
  margin: 14px 0 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
}
.na-close {
  margin-top: 12px;
}
.na-modal input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
}
.na-modal input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.na-error {
  margin-top: 10px !important;
  color: var(--vp-c-danger-1) !important;
}
.na-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;
}
.na-actions a {
  color: var(--vp-c-text-2);
}
.na-grow {
  flex: 1;
}
.na-ghost,
.na-primary {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}
.na-ghost {
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
}
.na-primary {
  border: 0;
  background: var(--vp-c-brand-1);
  color: #fff;
}
.na-primary:disabled {
  opacity: 0.6;
}
</style>
