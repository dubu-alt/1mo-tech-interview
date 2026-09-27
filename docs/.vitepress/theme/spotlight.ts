// Spotlight 검색창의 열림/닫힘 상태 (내비게이션 버튼, 독, 단축키가 함께 사용)
import { ref } from 'vue'

export const spotlightOpen = ref(false)
export const openSpotlight = () => {
  spotlightOpen.value = true
}
export const closeSpotlight = () => {
  spotlightOpen.value = false
}
export const toggleSpotlight = () => {
  spotlightOpen.value = !spotlightOpen.value
}
