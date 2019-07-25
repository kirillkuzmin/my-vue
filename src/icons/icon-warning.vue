<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    props: {
      color: {
        type: String,
        default: '#f7a827',
      },
    },

    data () {
      return {
        icon: {
          size: 24,
          paths: [
            {
              d: 'M0 0h24v24H0z',
              fill: 'none',
            },
            {
              d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
            },
          ],
        },
      };
    },
  };
</script>
