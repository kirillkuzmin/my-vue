<template>
  <div :class="tabsClass">
    <ul v-if="!this.fixed">
      <slot name="before"></slot>
      <li
        v-for="(tab, index) in tabs"
        :class="getTabClass(tab)"
        v-text="tab.title"
        @click="selectTab(tab, index)"
      >
      </li>
      <slot name="after"></slot>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      fixed: {
        type: Boolean,
        default: false,
      },

      linear: {
        type: Boolean,
        default: false,
      },

      showValidation: {
        type: Boolean,
        default: true,
      },
    },

    data () {
      return {
        tabs: [],
        selectedTabIndex: 0,
      };
    },

    created () {
      this.tabs = this.$children;

      if (this.fixed) {
        this.$bus.fire('my-tabs-fixed:init', this);
      }
    },

    computed: {
      $_forKeep: {
        get () {
          return this.selectedTabIndex;
        },
        set (newValue) {
          this.selectTab(this.tabs[newValue], newValue);
        },
      },
      
      tabsClass () {
        return [
          'my-tabs',
          {
            'my-tabs--linear': this.linear,
          },
        ];
      },
    },

    methods: {
      getTabClass (tab) {
        return [
          'my-tabs__tab',
          {
            'my-tabs__tab--active': tab.isActive,
            'my-tabs__tab--disabled': tab.isDisabled,
            'my-tabs__tab--has-errors': this.showValidation && tab.hasErrors,
          },
        ];
      },

      selectTab (selectedTab, ind) {
        this.selectedTabIndex = ind;

        if (!selectedTab.isDisabled) {
          this.tabs.forEach(tab => {
            tab.isActive = (tab.title === selectedTab.title);
          });

          this.$emit('tab-click', selectedTab);
        }
      },
    },
  };
</script>

<style lang="less">
  @error-background-color: #e95326;

  .my-tabs {
    background-color: #fff;

    & > ul {
      align-items: center;
      border-bottom: 2px solid #5c98d1;
      display: flex;
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    &__tab {
      background-color: #d5e4f3;
      color: #333;
      cursor: pointer;
      margin: 0 3px 0 0;
      padding: 8px 20px;
      white-space: nowrap;

      &:first-child {
        margin-left: 5px;
      }

      &:hover {
        background-color: #e9f1f9;
      }

      &--active {
        background-color: #5c98d1;
        color: #fff;
        cursor: default;

        &:hover {
          background-color: #5c98d1;
          cursor: default;
        }
      }

      &--disabled {
        background-color: #dde9f5;
        color: #bebebe;
        cursor: default;

        &:hover {
          background-color: #dde9f5;
          cursor: default;
        }
      }

      &--has-errors {
        background-color: @error-background-color;
        color: #fff;

        &:hover {
          background-color: @error-background-color;
        }
      }
    }

    &__pane {
      box-sizing: border-box;
      padding: 0;
    }

    &--linear {
      & ul {
        border-bottom: none;

        & li {
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
