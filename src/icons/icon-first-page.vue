<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    name: 'icon-first-page',

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
              d: 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
            },
            {
              d: 'M24 24H0V0h24v24z',
              fill: 'none',
            },
          ],
        },
      };
    },
  };
</script>
