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
          size: '24',
          paths: [
            {
              d: 'M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z',
            },
            {
              d: 'M0-.25h24v24H0z',
              fill: 'none',
            },
          ],
        },
      };
    },
  };
</script>
