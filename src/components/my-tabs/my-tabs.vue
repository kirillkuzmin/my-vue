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

    model: {
      prop: 'selected',
      event: 'change',
    },

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

      selected: {
        type: String,
        default: '',
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

      this.$nextTick(() => this.setActiveTab(this.selected));

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

      selectTab (tab, index) {
        this.selectedTabIndex = index;

        if (!tab.isDisabled) {
          this.$emit('change', tab.id);
        }
      },

      setActiveTab (tabId) {
        this.tabs.forEach(tab => tab.isActive = tab.id === tabId);
      },
    },

    watch: {
      selected (newVal) {
        this.setActiveTab(newVal);
      },
    },
  };
</script>