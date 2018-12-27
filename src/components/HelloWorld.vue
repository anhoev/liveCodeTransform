<template>
    <div class="hello">
        <p class="a">htllo</p>
        <textarea v-model="code">

        </textarea>
        <button v-on:click="compile">Compile</button>
        <button v-on:click="compile2">Transfrom to console</button>
        <!--<test-vue-loader-component></test-vue-loader-component>-->
        <div v-if="isCompiled">
            <test-vue-loader-component></test-vue-loader-component>
        </div>
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
  import TestVueLoaderComponent from '../../test/test-vue-loader-component';

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

  export default {
    name: 'HelloWorld',
    components: { TestVueLoaderComponent },
    props: {
      msg: String
    },
    data() {
      return {
        code: ``,
        isCompiled: false,
        isCompiled2: false
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

      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
