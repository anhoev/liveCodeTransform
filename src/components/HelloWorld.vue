<template>
    <div class="hello">
        <codemirror
                class="editor"
                ref="myCm"
                :value="code"
                :options="cmOptions"
                @input="onCodeChange"
        ></codemirror>
        <div>
            <button v-on:click="compile">Compile</button>
            <button v-on:click="compile2">Transfrom to console</button>
        </div>
        <div style="width: 100%">
            <div style="width: 50%">
                <textarea v-model="code" style="width: 800px; height: 500px"></textarea>
            </div>
            <div style="width: 50%">
                <div v-if="isCompiled">
                    <test-vue-loader-component></test-vue-loader-component>
                </div>
            </div>
        </div>

        <!--<test-vue-loader-component></test-vue-loader-component>-->

        <div v-if="isCompiled2">
            <test-vue-loader-component2></test-vue-loader-component2>
        </div>
    </div>
</template>

<script>
  import httpVueLoader from 'http-vue-loader';
  import Vue from 'vue';
  import { transform } from '@babel/core';
  import babelPluginTransformModulesCommonJs from '@babel/plugin-transform-modules-commonjs';
  import babelPluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import';
  import babelPluginSyntaxImportMeta from '@babel/plugin-syntax-import-meta';
  import _ from 'lodash';
  import sass from 'sass.js';
  import CodeMirror, { codemirror } from 'vue-codemirror';// require styles
  import 'codemirror/mode/vue/vue.js';
  import 'codemirror/mode/javascript/javascript.js';
  import 'codemirror/addon/edit/closetag.js';
  import 'codemirror/mode/xml/xml.js';
  import 'codemirror/mode/css/css.js';
  import 'codemirror/mode/htmlmixed/htmlmixed.js';
  import 'codemirror/theme/base16-dark.css';
  import 'codemirror/lib/codemirror.css';

  Vue.use(CodeMirror);

  window['lodash'] = _;

  // This PR adds the feature
  // Enables custom handling of script exports
  httpVueLoader.scriptExportsHandler = function (exports) {
    return exports.default;
  };

  // This PR slightly fixes this feature as well
  httpVueLoader.langProcessor.js = function (script) {
    return transform(script, {
      // Enables an access to `this` of the Component
      // so that this transform can obtain the proper information
      // of the instance of Component
      moduleId: this.name,
      plugins: [
        babelPluginSyntaxImportMeta,
        babelPluginSyntaxDynamicImport,
        babelPluginTransformModulesCommonJs
      ]
    }).code;
  };

  httpVueLoader.langProcessor.scss = function (scssText) {
    return new Promise(function (resolve, reject) {
      sass.compile(scssText, function (result) {
        if (result.status === 0) {
          resolve(result.text);
        } else {
          reject(result);
        }
      });
    });
  };

  export default {
    name: 'HelloWorld',
    components: { codemirror },
    props: {
      msg: String
    },
    data() {
      return {
        code: ``,
        isCompiled: false,
        isCompiled2: false,
        cmOptions: {
          // codemirror options
          tabSize: 2,
          mode: 'text/x-vue',
          lineNumbers: true,
          theme: 'base16-dark',
          autoCloseTags: true,
          collapseIdentical: false,
          highlightDifferences: true
          // more codemirror options, 更多 codemirror 的高级配置...
        }
      };
    },
    methods: {
      compile2: function () {
        httpVueLoader.transformCode(this.code).then(console.log);
      },
      compile: function () {

        httpVueLoader.registerString(Vue, this.code, 'test-vue-loader-component2', false);
        this.isCompiled2 = true;
        this.$forceUpdate();

      },
      onCodeChange(code) {
        this.code = code;
      }
    },
    computed: {
      codemirror() {
        return this.$refs.myCm.codemirror;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    body {
        margin: 0;
        padding: 0;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .a {
        color: blue
    }

    .editor {
        width: 600px;
        height: 800px;
        text-align: left;
    }
</style>
