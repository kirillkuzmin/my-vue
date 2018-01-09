<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    props: {
      color: {
        type: String,
        default: '#4caf50',
      },
    },

    data () {
      return {
        icon: {
          size: 24,
          paths: [
            {
              d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
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