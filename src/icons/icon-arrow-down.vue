<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    props: {
      color: {
        type: String,
        default: '#000',
      },
    },

    data () {
      return {
        icon: {
          size: 24,
          paths: [
            {
              d: 'M7 10l5 5 5-5z',
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