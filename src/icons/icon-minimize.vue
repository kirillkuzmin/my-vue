<script>
  import MyIcon from 'components/my-icon';

  export default {
    extends: MyIcon,

    data () {
      return {
        icon: {
          size: 24,
          paths: [
            {
              d: 'M6 19h12v2H6z',
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