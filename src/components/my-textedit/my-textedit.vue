<template>
  <div style="padding: 0; width: 390px; height: auto;">
    <div
      class="my-textedit__edit"
      @click="vsbl = !vsbl"
      v-html="'&#9998;'"
      title="Редактирование и предпросмотр"
    ></div>
    <div v-if="vsbl" class="btn-group" style="100%: inherit; background: #1ab7f2;">
      <button class="button_te" tag="b" @click="tagIns"><b>B</b></button>
      <button class="button_te" tag="i" @click="tagIns"><i>I</i></button>
      <button class="button_te" tag="u" @click="tagIns"><u>U</u></button>
      <button class="button_te" tag="h6" @click="tagIns">Заголовок</button>
      <button class="button_te" tag="ol" @click="tagIns">&lt;ol&gt;</button>
      <button class="button_te" tag="li" @click="tagIns">&bull;</button>
      <button class="button_te" tag="br" @click="oneTagIns">br</button>
      <button class="button_te" style="text-decoration: line-through" @click="unTag">&lt;Tag&gt;</button>
      <button class="button_te" @click="undo" :disabled="undoDisabled">&#8630</button>
    </div>
    <div>
			<textarea
        style="width: 100%; box-sizing: border-box; "
        :id="nam"
        v-model="textValue"
        :title="hint"
        :rows="rows"
        :cols="cols"
        @keydown="chng"
        @paste="pst"
        @input="inputdt"
      >
			</textarea>
    </div>
    <div v-html="textValue" class="my-textedit__preview" v-if="vsbl"></div>
  </div>
</template>

<script>
  // plak 07.2017 пытаюсь сделать компонент для ввода и редактирования текста с html-тегами

  let before = []; // Зачем!?!?? -спросите вы? - "Internet Explorer.."
  // при создании нового экземпляра компонента эта штука не чистится, а нам это на руку,
  // т.к. можно сразу 2 окошка редактировать и им вместе не грустно.

  export default {
    props: {
      rows: String,

      cols: String,

      value: String,

      hint: {
        type: String,
        default: '',
      },

      nam: String,
      //
    },

    data() {
      return {
        vsbl: false,
        textValue: '',
        undoDisabled: true,
      };
    },

    watch: {
      value(val, oldval) {
        this.textValue = val;
      },
    },

    created() {
      before[this.nam] = [];

      this.$bus.listen('my-textedit:clearUndoBuffer', () => {
        before[this.nam] = [];
      });
    },
    mounted() {
      this.textValue = this.value;
    },

    methods: {
      undo(e) {
        if (e) e.preventDefault();
        if (before[this.nam].length === 0) {
          this.undoDisabled = true;
          return;
        }
        this.textValue = before[this.nam].pop();
        this.$emit('input', this.textValue);
      },

      createTagTree() {
        let tagTree = [];
        let regexp = /<(\/?)([^\s^\/^<]*?)(?:\s+|\s+[^>]*)?>/gm;
        let res, isOpen;
        let qq;

        while (res = regexp.exec(this.textValue)) {
          isOpen = res[1] !== '/';
          qq = -2;

          if (!isOpen) {
            qq = _.findLastIndex(tagTree, (e) => {
              return (e.tag == res[2] && e.isOpen && e.tagId == -2);
            });
            if (qq > -1) {
              tagTree[qq].tagId = qq;
            }
          }

          tagTree.push({
            tag: res[2],
            isOpen: isOpen,
            tagId: qq,
            beg: res.index,
            end: res.index + res[0].length,
          });
        }
        return tagTree;
      },

      tagIns(e) {
        e.preventDefault();
        this.chng();
        let tag = e.currentTarget.getAttribute('tag');
        let tArea = document.getElementById(this.nam);
        let selS = tArea.selectionStart;
        let selE = tArea.selectionEnd;

        let tagTree = this.createTagTree();

        if (-1 == _.findIndex(tagTree, (e) => {
            return (e.beg < selS && e.end > selE);
          })) {

          this.textValue = this.textValue.slice(0, selE) + '</' + tag + '>' + this.textValue.slice(selE);
          this.textValue = this.textValue.slice(0, selS) + '<' + tag + '>' + this.textValue.slice(selS);
          this.$emit('input', this.textValue);
        }
      },

      oneTagIns(e) {
        e.preventDefault();

        let tag = e.currentTarget.getAttribute('tag');
        let tArea = document.getElementById(this.nam);
        let selS = tArea.selectionStart;
        let selE = tArea.selectionEnd;

        let tagTree = this.createTagTree();

        if (-1 == _.findIndex(tagTree, (e) => {
            return (e.beg < selS && e.end > selE);
          })) {
          this.chng();
          this.textValue = this.textValue.slice(0, selE) + '<' + tag + '>' + this.textValue.slice(selE);
          this.$emit('input', this.textValue);
        }
      },

      unTag(e) {
        e.preventDefault();
        let tArea = document.getElementById(this.nam);
        let selS = tArea.selectionStart;
        let selE = tArea.selectionEnd;
        let inTag = -1;
        let clTag = -1;
        let opTag = -1;
        let iclTag = -1;
        let iopTag = -1;
        let el;

        let tagTree = this.createTagTree();

        inTag = _.findIndex(tagTree, (e) => {
          return (e.beg < selS && e.end > selE);
        });

        if (inTag != -1) {
          el = tagTree[inTag];
          if (el.tagId == -2) {// если жмакнули по одинокому тэгу, то удаляем его нафиг
            this.chng();
            this.textValue = this.textValue.slice(0, el.beg) + this.textValue.slice(el.end);
            this.$emit('input', this.textValue);
            return;
          }
        }

        // это последний элемент, претендующий на открытый тег..
        iopTag = _.findLastIndex(tagTree, (e) => {
          return (e.end <= selS && e.tagId != -2 && e.isOpen);
        });

        // это первый элемент, претендующий на закрытый тег..
        iclTag = _.findIndex(tagTree, (e) => {
          return (e.beg >= selE && e.tagId != -2 && !e.isOpen);
        });

        while (iopTag >= 0) {
          opTag = _.findLastIndex(tagTree.slice(0, iopTag + 1), (e) => {
            return (e.tagId != -2 && e.isOpen);
          });

          if (opTag != -1) {
            clTag = _.findIndex(tagTree.slice(iclTag), (e) => {
              return (e.tagId == tagTree[opTag].tagId && !e.isOpen && e.tag == tagTree[opTag].tag);
            });
            if (clTag != -1) {
              clTag += iclTag;
              break;
            }
          } else {
            break;
          }
          iopTag--;
        }

        if (opTag != -1 && clTag != -1) {
          this.chng();
          this.textValue = this.textValue.slice(0, tagTree[clTag].beg) + this.textValue.slice(tagTree[clTag].end);
          this.textValue = this.textValue.slice(0, tagTree[opTag].beg) + this.textValue.slice(tagTree[opTag].end);
          this.$emit('input', this.textValue);
        }
      },

      pst(e) {
        this.chng();
      },

      chng(e) {
        let isInput = false;

        if (e !== undefined) {
          // e.preventDefault();
          // return;

          isInput = (e.char || e.key).length == 1 && !(e.altKey || e.ctrlKey || e.shiftKey);
          if (e.code == 'KeyZ' && e.ctrlKey) {
            e.preventDefault();
            this.undo();
          }
        } else {
          isInput = true;
        }

        if (isInput) {
          if (before[this.nam].length >= 20) {
            before[this.nam].shift();
          }

          before[this.nam][before[this.nam].length] = this.textValue;
          this.undoDisabled = false;
        }
      },

      inputdt(inp) {
        this.$emit('input', this.textValue);
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-textedit__edit {
    width: 18px;
    height: 18px;
    font-size: 12 pх;
    text-align: center;
    background-color: #1ab7f2;
    color: greenyellow;
    display: inline-block;
    cursor: pointer;
    float: left;
  }

  .btn-group .button_te {
    background-color: #1ab7f2;
    border: none;
    color: black;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
    //width: -100%;
  }

  .my-textedit__preview {
    width: 100%;
    box-sizing: border-box;
    height: auto;
    border-style: inset;
    padding: 10px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: auto;
  }

  .btn-group .button_te:hover {
    background-color: #0b8abb;
  }
</style>
