<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    props: {
      color: {
        type: String,
        default: '#00a9e0',
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
              d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
            },
          ],
        },
      };
    },
  };
</script>
