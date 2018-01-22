<template>
  <div ref="datepicker" class="my-datepicker" v-click-outside="hide">
    <div ref="element" class="my-datepicker__element">
      <input
        :class="inputClass"
        :id="id"
        :name="name"
        :value="getValue()"
        readonly
        ref="input"
        type="text"
        v-if="!noInput"
      >
      <icon-datepicker
        class="my-datepicker__icon"
        @click="show"
      />
    </div>
    <div ref="calendar" class="my-datepicker__calendar" v-show="showMe">
      <div class="my-datepicker__nav">
        <icon-arrow-left
          :disabled="isStart"
          class="my-datepicker__icon"
          @click="getPrevious"
        />
        <select class="my-datepicker__select" v-model="month" @change="drawCalendar">
          <option
            v-for="(month, index) in $trans('months')"
            :value="index + 1"
            v-text="month"
          >
          </option>
        </select>
        <select class="my-datepicker__select" v-model="year" @change="drawCalendar">
          <option
            v-for="year in yearRange()"
            :value="year"
            v-text="year"
          >
          </option>
        </select>
        <icon-arrow-right
          :disabled="isEnd"
          class="my-datepicker__icon"
          @click="getNext"
        />
      </div>
      <table class="my-datepicker__table">
        <thead>
        <tr>
          <td v-for="(day, index) in $trans('days')" v-text="day"></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(week, w) in grid">
          <td
            v-for="(dayNum, d) in week"
            :class="{ 'my-datepicker__day': dayNum, 'my-datepicker__day--selected': isSelected(dayNum), 'my-datepicker__day--today': isToday(dayNum) }"
            v-text="dayNum"
            @click="selectDay(dayNum)"
          >
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="withTime">
        <div class="my-datepicker__subheader" v-text="$trans('myDatepicker.chooseTime')"></div>
        <div class="my-datepicker__time">
          <select v-model="hour" @change="changeTime(true)">
            <option
              v-for="(hr, h) in Array(24)"
              v-text="addZero(h)"
            >
            </option>
          </select>
          <span>:</span>
          <select v-model="minute" @change="changeTime(false)">
            <option
              v-for="m in ['00', '10', '20', '30', '40', '50']"
              v-text="m"
            >
            </option>
          </select>
        </div>
        <button
          class="my-datepicker__save"
          type="button"
          v-if="withSave"
          @click="$emit('save')"
          v-text="$trans('myDatepicker.btnSave')"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import IconArrowLeft from 'icons/icon-arrow-left.vue';
  import IconArrowRight from 'icons/icon-arrow-right.vue';
  import IconDatepicker from 'icons/icon-datepicker.vue';
  import parse from 'date-fns/parse';
  import Validator from 'classes/Validator';

  export default {
    name: 'my-datepicker',

    props: {
      defaultTime: {
        type: String,
        default () {
          // TODO: refactor
          let currentDate = new Date();
          let ut = parseInt(currentDate.getTime() / 1000, 10);
          let cc = ut - (ut % 60);

          cc = cc % 600 ? cc + (600 - cc % 600) : cc;

          const d = new Date(cc * 1000);

          let minutes = d.getMinutes();

          // minutes = minutes - (minutes % 10) + (minutes < 50 ? 10 : 0);

          let hours = d.getHours();

          return (parseInt(hours, 10) < 10 ? '0' : '') + hours + ':' + minutes.toString().padStart(2, '0');
        },
      },

      endYear: {
        type: Number,
        default: 2027,
      },

      id: String,

      initValue: String,

      name: String,

      noInput: {
        type: Boolean,
        default: false,
      },

      startYear: {
        type: Number,
        default: 2007,
      },

      value: String,

      validate: String,

      withSave: {
        type: Boolean,
        default: false,
      },

      withTime: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        dayNum: null,

        grid: [],

        hour: null,

        minute: null,

        month: null,

        relative: true,

        selectedDate: '',

        selectedTime: (this.withTime ? this.defaultTime : ''),

        showMe: false,

        year: null,
      };
    },

    components: {
      IconArrowLeft,
      IconArrowRight,
      IconDatepicker,
    },

    created () {
      this.init();
    },

    mounted () {
      if (this.validate) {
        this.validator = new Validator(this.$refs.input, 'value', this.validate);

        this.$on('validation-error', error => {
          this.validator.setError(error);
        });
      }

      // temp
      if (this.$parent.$options._componentTag === 'my-modal') {
        this.$refs.datepicker.style.position = 'static';
        this.relative = false;
      }
    },

    computed: {
      inputClass () {
        return [
          'my-datepicker__input',
          {
            'my-datepicker__input--time': this.withTime,
          },
        ];
      },

      isStart () {
        return (this.year === this.startYear && this.month === 1);
      },

      isEnd () {
        return (this.year === this.endYear && this.month === 12);
      },
    },

    methods: {
      init (update = true) {
        // initial value
        const v = this.getValue() || this.initValue;

        if (v) {
          let d = new Date(parse(v));

          this.dayNum = d.getDate();

          this.month = d.getMonth() + 1;

          this.year = d.getFullYear();

          this.hour = this.addZero(d.getHours());

          this.minute = this.addZero(d.getMinutes());

          this.selectedDate = this.getDate();

          this.selectedTime = this.getTime();

          if (update) {
            this.$emit('input', this.getDateAndTime());
          }
        } else {
          this.month = this.getCurrentMonth();

          this.year = this.getCurrentYear();

          const t = this.defaultTime.split(':');

          this.hour = this.addZero(t[0]);

          this.minute = this.addZero(t[1]);
        }
      },

      addZero (v) {
        v = parseInt(v, 10);

        return (v < 10 ? '0' + v : v);
      },

      getValue () {
        return this.value;
      },

      daysInThisMonth () {
        return new Date(this.year, this.month, 0).getDate();
      },

      getPrevious () {
        if (this.isStart) {
          return false;
        }

        if (this.month === 1) {
          this.year--;
          this.month = 12;
        } else {
          this.month--;
        }

        this.drawCalendar();
      },

      getNext () {
        if (this.isEnd) {
          return false;
        }

        if (this.month === 12) {
          this.year++;
          this.month = 1;
        } else {
          this.month++;
        }

        this.drawCalendar();
      },

      getDate () {
        if (this.dayNum) {
          // TODO: different formats
          return this.getYear() + '-' + this.getMonth() + '-' + this.getDay();
        } else {
          return this.initValue;
        }
      },

      getTime () {
        if (this.withTime) {
          return this.addZero(this.getHour()) + ':' + this.addZero(this.getMinute());
        }
      },

      getDateAndTime () {
        return this.selectedDate + (this.selectedTime ? ' ' + this.selectedTime : '');
      },

      getCurrentDay () {
        return new Date().getDate();
      },

      getCurrentMonth () {
        return new Date().getMonth() + 1;
      },

      getCurrentYear () {
        return new Date().getFullYear();
      },

      getCurrentHour () {
        return this.addZero(new Date().getHours());
      },

      getCurrentMinute () {
        return this.addZero(new Date().getMinutes());
      },

      drawCalendar () {
        const firstOfMonth = new Date(this.year, this.month - 1, 1);

        const lastOfMonth = new Date(this.year, this.month, 0);

        const leadDays = (firstOfMonth.getDay() + 6) % 7;

        const countofWeeks = Math.ceil((leadDays + this.daysInThisMonth()) / 7);

        let grid = [];

        let day = 1;

        for (let w = 1; w <= countofWeeks; w++) {
          let week = grid[w] = [];

          for (let j = 0; j <= 6; j++) {
            if (w === 1 && firstOfMonth.getDay() === 0) {
              j = 6;
            }

            if (w === 1 && j < leadDays) {
              week[j] = '';
            } else if (w === countofWeeks && lastOfMonth.getDay() > 0 && (j > lastOfMonth.getDay() - 1)) {
              week[j] = '';
            } else {
              week[j] = day;
              day++;
            }
          }
        }

        this.grid = grid;

        if (this.showMe) {
          this.setPosition();
        }
      },

      selectDay (dayNum) {
        if (dayNum) {
          this.dayNum = dayNum;

          this.selectedDate = this.getDate();

          this.$emit('input', this.getDateAndTime());

          if (!this.withTime) {
            this.showMe = false;
          }
        }
      },

      changeTime (resetMinutes = false) {
        if (resetMinutes) {
          this.minute = '00';
        }

        this.selectedTime = this.getTime();

        if (this.selectedDate) {
          this.$emit('input', this.getDateAndTime());
        }
      },

      getDay () {
        return (this.dayNum < 10 ? '0' : '') + this.dayNum;
      },

      getMonth () {
        return (this.month < 10 ? '0' : '') + this.month;
      },

      getYear () {
        return this.year;
      },

      getHour () {
        return this.hour || new Date().getHours();
      },

      getMinute () {
        return this.minute || new Date().getMinutes();
      },

      isToday (dayNum) {
        return (dayNum === this.getCurrentDay() && this.month === this.getCurrentMonth() && this.year === this.getCurrentYear());
      },

      isSelected (dayNum) {
        const d = new Date(parse(this.getValue()));

        return (dayNum === d.getDate() && this.month === (d.getMonth() + 1) && this.year === d.getFullYear());
      },

      yearRange () {
        let range = [];

        for (let y = this.startYear; y <= this.endYear; y++) {
          range.push(y);
        }

        return range;
      },

      getPosition () {
        let pos = 0;

        const el = this.$refs.element;

        const calendar = this.$refs.calendar;

        // TODO: no footer
        const footer = document.getElementsByTagName('footer')[0];

        const elTop = el.getBoundingClientRect().top;

        const elBottom = el.getBoundingClientRect().bottom;

        if ((elBottom + calendar.offsetHeight) > footer.getBoundingClientRect().top) {
          pos = -calendar.offsetHeight;
        } else {
          pos = el.offsetHeight;
        }

        return (this.relative ? pos : elTop + pos) + 'px';
      },

      setPosition () {
        this.$nextTick(() => {
          this.$refs.calendar.style.top = this.getPosition();
        });
      },

      show () {
        this.init(false);

        this.drawCalendar();

        this.showMe = true;

        this.setPosition();
      },

      hide () {
        this.showMe = false;
      },
    },
  };
</script>