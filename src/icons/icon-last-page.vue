<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    name: 'icon-last-page',

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
              d: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
            },
            {
              d: 'M0 0h24v24H0V0z',
              fill: 'none',
            },
          ],
        },
      };
    },
  };
</script>
