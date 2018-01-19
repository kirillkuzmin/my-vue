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
              d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
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