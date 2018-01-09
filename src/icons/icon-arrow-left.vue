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
              d: 'M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z',
            },
            {
              d: 'M0-.5h24v24H0z',
              fill: 'none',
            },
          ],
        },
      };
    },
  };
</script>
