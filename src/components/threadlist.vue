<template>
  <base-component :title="`Active threads on /${selectedBoard}/`" class="base-component">
    <button class="absolute close-button h-10 w-10" @click="closeThreadSideBar">
      Hide threads
    </button>
    <div class="absolute inset-0 h-full">
      <div v-if="selectedBoard" class="flex flex-col absolute inset-0 h-full">
        <a
          v-for="(thread, index) in threadData[selectedBoard].slice(0, threadsToShow)"
          :key="thread.no"
          class="thread flex flex-1 relative min-h-0"
          :href="`https://boards.4chan.org/${selectedBoard}/thread/${thread.no}`"
          target="_blank"
          rel="noopener"
        >
          <div class="img-wrapper">
            <img
              class="img-wrapper__img"
              :src="thread.image"
              :alt="`${selectedBoard} thread image ${index}`"
              referrerpolicy="same-origin"
              @error="
                $store.commit('replaceThreadThumbnail', {
                  selectedBoard,
                  index
                })
              "
            />
          </div>
          <div class="text-wrapper px-2 text-xs">
            <div v-if="thread.sticky" class="my-2 underline color-faded">
              Sticky Thread -
              {{ thread.age > 1000 * 60 * 60 * 24 ? Math.floor(thread.age / (1000 * 60 * 60 * 24)) + "d" : "" }}
              {{ Math.floor((thread.age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h" }}
              {{ Math.floor((thread.age % (1000 * 60 * 60)) / (1000 * 60)) + "m" }}
            </div>
            <div v-else class="my-2 underline color-faded">
              {{ thread.postsPerMinute.toFixed(2) }} posts/min - {{ thread.replies || -1 }} replies -
              {{ thread.age > 1000 * 60 * 60 * 24 ? Math.floor(thread.age / (1000 * 60 * 60 * 24)) + "d" : "" }}
              {{ Math.floor((thread.age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h" }}
              {{ Math.floor((thread.age % (1000 * 60 * 60)) / (1000 * 60)) + "m" }}
            </div>
            <div v-if="thread.sub" class="font-bold whitespace-no-wrap my-2" v-html="thread.sub || '(no title)'" />
            <div class="" v-html="thread.com" />
          </div>
        </a>
      </div>
    </div>
  </base-component>
</template>

<script>
import { mapState } from "vuex"
import baseComponent from "components/baseComponent.vue"
export default {
  components: {
    baseComponent
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(["threadData", "enabledBoards", "selectedBoard"]),
    threadsToShow: function() {
      const newListHeight = 36 + this.enabledBoards.length * 21
      return Math.max(Math.floor(newListHeight / 128), 5)
    }
  },
  created() {},
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type == "setSelectedBoard") {
        this.revealThreadSideBar(true)
      }
    })

    const componentEl = document.querySelector(".base-component")
    let start = [0, 0]

    document.addEventListener(
      "touchstart",
      function(e) {
        start = [e.touches[0].clientX, e.touches[0].clientY]
        componentEl.classList.add("is-touching")
      },
      {
        passive: true
      },
      false
    )

    document.addEventListener(
      "touchmove",
      function(e) {
        const delta = [e.touches[0].clientX - start[0], e.touches[0].clientY - start[1]]
        let extraTranslateX = (delta[0] / window.innerWidth) * 100

        extraTranslateX = Math.max(-100, extraTranslateX)
        if (componentEl.classList.contains("revealed")) {
          extraTranslateX = Math.max(0, extraTranslateX)
        }
        componentEl.style.setProperty("--extraTranslateX", extraTranslateX + "%")
      },
      {
        passive: true
      },
      false
    )

    document.addEventListener(
      "touchend",
      e => {
        componentEl.classList.remove("is-touching")
        componentEl.style.setProperty("--extraTranslateX", 0 + "%")
        const delta = [e.changedTouches[0].clientX - start[0], e.changedTouches[0].clientY - start[1]]

        const absX = Math.abs(delta[0])
        const absy = Math.abs(delta[1])

        if (absX < 64 && absy < 64) return
        if (absX > absy * 2.5) {
          if (delta[0] > 0) {
            this.closeThreadSideBar()
          } else {
            this.revealThreadSideBar(false)
          }
        }
      },
      {
        passive: true
      },
      false
    )
  },
  methods: {
    revealThreadSideBar(doScrollToTop) {
      if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >= 768) return
      document.querySelector(".base-component").classList.add("revealed")
      if (doScrollToTop) {
        document.querySelector(".component-nav").scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }
    },
    closeThreadSideBar() {
      document.querySelector(".base-component").classList.remove("revealed")
    }
  }
}
</script>

<style scoped lang="scss">
@include mobile {
  .close-button {
    z-index: 10000;
    top: -2.5rem;
    right: 0;
    min-width: 8rem;
    color: var(--nav-text-color);
  }

  .base-component {
    --extraTranslateX: 0%;
    z-index: 9999;
    transition: all 0.618s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    transform: translateX(calc(100% + var(--extraTranslateX)));
    &.revealed {
      transform: translateX(calc(0% + var(--extraTranslateX)));
    }
    &.is-touching {
      transition: none;
    }
  }
}
.text-wrapper {
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.thread {
  overflow: hidden;
  background: var(--bg1);
  &:nth-child(2n) {
    background: var(--bg2);
  }
}

.img-wrapper {
  transition: all 0.618s ease-out;
  @include touch {
    min-width: 125px;
    width: 20%;
    &__img {
      width: 125px;
      min-width: 20%;
    }
  }
  @include desktop {
    min-width: 20%;
    &__img {
      min-width: 20%;
      max-width: 20%;
    }
    &:hover > &__img {
      min-width: 20%;
      max-width: 100%;
    }
  }
  &__img {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    object-fit: cover;
  }
}
</style>
