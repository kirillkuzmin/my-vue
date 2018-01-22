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
    name: 'my-tabs',

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