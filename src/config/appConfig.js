// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Indent from '@ckeditor/ckeditor5-indent/src/indent';
// import Font from '@ckeditor/ckeditor5-font/src/font';

const appConfig = {
  editor: {
    toolbarType: {
      email: {
        // plugins: [Indent, Font],
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'unlink',
            '|',
            'alignment',
            '|',
            'outdent',
            'indent',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'fontColor',
            'highlight',
          ],
        },
      },
      notes: {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'unlink',
            '|',
            'alignment',
            '|',
            'outdent',
            'indent',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'fontColor',
            'highlight',
          ],
        },
      },
      restrictedMode: {
        toolbar: {
          items: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'link', 'unlink', '|'],
        },
      },
    },
  },
};

export default appConfig;
