<template>
  <div class="my-tree">
    <div :class="branchClass" @click="toggle" v-if="isBranch">
      <template v-if="isBranch">
        <icon-folder v-if="!this.open"/>
        <icon-folder-open v-else/>
      </template>
      <span v-text="model.title"></span>
    </div>
    <div class="my-tree__leaf" @click="clickLeaf(model)" v-else>
      <template v-if="isBranch">
        <icon-folder v-if="!this.open"/>
        <icon-folder-open v-else/>
      </template>
      <template v-else>
        <icon-description/>
      </template>
      <span v-text="model.title"></span>
    </div>
    <div v-show="open" v-if="isBranch">
      <my-tree
        v-for="(tree, index) in model.children"
        :key="index"
        :model="tree"
      />
    </div>
  </div>
</template>

<script>
  import IconDescription from 'icons/icon-description.vue';
  import IconFolder from 'icons/icon-folder.vue';
  import IconFolderOpen from 'icons/icon-folder-open.vue';

  export default {
    name: 'my-tree',

    props: {
      model: {
        type: Object,
        default: {},
      },

      /*expandedIcon: {
        type: String,
        default: '',
      },

      collapsedIcon: {
        type: String,
        default: '',
      },

      leafIcon: {
        type: String,
        default: '',
      },*/
    },

    data () {
      return {
        open: false,
      };
    },

    components: {
      IconDescription,
      IconFolder,
      IconFolderOpen,
    },

    computed: {
      branchClass () {
        return [
          'my-tree__branch',
          {
            'my-tree__branch--disabled': this.emptyBranch,
          },
        ];
      },

      isBranch () {
        return (this.model.children && this.model.children.length) ||
          this.model.type === 'branch';
      },

      emptyBranch () {
        return false;
      },
    },

    methods: {
      toggle () {
        if (this.isBranch) {
          this.open = !this.open;
        }
      },

      clickLeaf (leaf) {
        if (typeof leaf.click === 'function') {
          leaf.click();
        } else {
          this.$bus.fire('my-tree:leaf-click', leaf);
        }
      },
    },
  };
</script>