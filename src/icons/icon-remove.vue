<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    props: {
      color: {
        type: String,
        default: '#f44336',
      },
    },

    data () {
      return {
        icon: {
          size: 24,
          paths: [
            {
              d: 'M19 13H5v-2h14v2z',
            },
            {
              d: 'M0 0h24v24H0z',
              fill: 'none',
            },
          ],
        },
      };
    },
  };
</script>