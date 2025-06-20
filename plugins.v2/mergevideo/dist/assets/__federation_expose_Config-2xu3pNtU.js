import { importShared } from './__federation_fn_import-JrT3xvdd.js';

const {createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,createElementVNode:_createElementVNode,withModifiers:_withModifiers,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "plugin-config" };

const {ref,reactive,onMounted} = await importShared('vue');


// 接收初始配置

const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: {
    type: Object,
    default: () => ({}),
  },
  api: {
    type: Object,
    default: () => {},
  },
},
  emits: ['save', 'close', 'switch'],
  setup(__props, { emit: __emit }) {

const props = __props;

// 表单状态
const form = ref(null);
const isFormValid = ref(true);
const error = ref(null);
const saving = ref(false);
const showApiKey = ref(false);

// 更新频率选项
const updateIntervalOptions = [
  { text: '5分钟', value: 5 },
  { text: '15分钟', value: 15 },
  { text: '30分钟', value: 30 },
  { text: '1小时', value: 60 },
  { text: '2小时', value: 120 },
  { text: '6小时', value: 360 },
  { text: '12小时', value: 720 },
  { text: '1天', value: 1440 },
];

// 配置数据，使用默认值和初始配置合并
const defaultConfig = {
  name: '我的插件',
  description: '',
  enable: true,
  update_interval: 60,
  api_url: '',
  api_key: '',
  concurrent_tasks: 3,
  tags: [],
};

// 合并默认配置和初始配置
const config = reactive({ ...defaultConfig });

// 初始化配置
onMounted(() => {
  // 加载初始配置
  if (props.initialConfig) {
    Object.keys(props.initialConfig).forEach(key => {
      if (key in config) {
        config[key] = props.initialConfig[key];
      }
    });
  }
});

// 自定义事件，用于保存配置
const emit = __emit;

// 保存配置
async function saveConfig() {
  if (!isFormValid.value) {
    error.value = '请修正表单错误';
    return
  }

  saving.value = true;
  error.value = null;

  try {
    // 模拟API调用等待
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 发送保存事件
    emit('save', { ...config });
  } catch (err) {
    console.error('保存配置失败:', err);
    error.value = err.message || '保存配置失败';
  } finally {
    saving.value = false;
  }
}

// 重置表单
function resetForm() {
  Object.keys(defaultConfig).forEach(key => {
    config[key] = defaultConfig[key];
  });

  if (form.value) {
    form.value.resetValidation();
  }
}

// 通知主应用关闭组件
function notifyClose() {
  emit('close');
}

return (_ctx, _cache) => {
  const _component_v_card_title = _resolveComponent("v-card-title");
  const _component_v_icon = _resolveComponent("v-icon");
  const _component_v_btn = _resolveComponent("v-btn");
  const _component_v_card_item = _resolveComponent("v-card-item");
  const _component_v_alert = _resolveComponent("v-alert");
  const _component_v_switch = _resolveComponent("v-switch");
  const _component_v_col = _resolveComponent("v-col");
  const _component_v_text_field = _resolveComponent("v-text-field");
  const _component_v_textarea = _resolveComponent("v-textarea");
  const _component_v_row = _resolveComponent("v-row");
  const _component_v_select = _resolveComponent("v-select");
  const _component_v_expansion_panel_title = _resolveComponent("v-expansion-panel-title");
  const _component_v_slider = _resolveComponent("v-slider");
  const _component_v_combobox = _resolveComponent("v-combobox");
  const _component_v_expansion_panel_text = _resolveComponent("v-expansion-panel-text");
  const _component_v_expansion_panel = _resolveComponent("v-expansion-panel");
  const _component_v_expansion_panels = _resolveComponent("v-expansion-panels");
  const _component_v_form = _resolveComponent("v-form");
  const _component_v_card_text = _resolveComponent("v-card-text");
  const _component_v_spacer = _resolveComponent("v-spacer");
  const _component_v_card_actions = _resolveComponent("v-card-actions");
  const _component_v_card = _resolveComponent("v-card");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode(_component_v_card, null, {
      default: _withCtx(() => [
        _createVNode(_component_v_card_item, null, {
          append: _withCtx(() => [
            _createVNode(_component_v_btn, {
              icon: "",
              color: "primary",
              variant: "text",
              onClick: notifyClose
            }, {
              default: _withCtx(() => [
                _createVNode(_component_v_icon, { left: "" }, {
                  default: _withCtx(() => _cache[11] || (_cache[11] = [
                    _createTextVNode("mdi-close")
                  ])),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          default: _withCtx(() => [
            _createVNode(_component_v_card_title, null, {
              default: _withCtx(() => _cache[10] || (_cache[10] = [
                _createTextVNode("插件配置")
              ])),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode(_component_v_card_text, { class: "overflow-y-auto" }, {
          default: _withCtx(() => [
            (error.value)
              ? (_openBlock(), _createBlock(_component_v_alert, {
                  key: 0,
                  type: "error",
                  class: "mb-4"
                }, {
                  default: _withCtx(() => [
                    _createTextVNode(_toDisplayString(error.value), 1)
                  ]),
                  _: 1
                }))
              : _createCommentVNode("", true),
            _createVNode(_component_v_form, {
              ref_key: "form",
              ref: form,
              modelValue: isFormValid.value,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((isFormValid).value = $event)),
              onSubmit: _withModifiers(saveConfig, ["prevent"])
            }, {
              default: _withCtx(() => [
                _cache[13] || (_cache[13] = _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold mt-4 mb-2" }, "基本设置", -1)),
                _createVNode(_component_v_row, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_v_col, { cols: "12" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_switch, {
                          modelValue: config.enable,
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((config.enable) = $event)),
                          label: "启用插件",
                          color: "primary",
                          inset: "",
                          hint: "启用插件后，插件将开始工作",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_v_col, { cols: "12" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_text_field, {
                          modelValue: config.name,
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((config.name) = $event)),
                          label: "插件名称",
                          variant: "outlined",
                          rules: [v => !!v || '名称不能为空'],
                          hint: "显示在插件列表中的名称"
                        }, null, 8, ["modelValue", "rules"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_v_col, { cols: "12" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_textarea, {
                          modelValue: config.description,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((config.description) = $event)),
                          label: "插件描述",
                          variant: "outlined",
                          rows: "3",
                          hint: "简要说明插件的功能和用途"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _cache[14] || (_cache[14] = _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold mt-4 mb-2" }, "功能配置", -1)),
                _createVNode(_component_v_row, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_v_col, { cols: "12" }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_select, {
                          modelValue: config.update_interval,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((config.update_interval) = $event)),
                          label: "更新频率",
                          items: updateIntervalOptions,
                          variant: "outlined",
                          "item-title": "text",
                          "item-value": "value"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _cache[15] || (_cache[15] = _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold mt-4 mb-2" }, "API设置", -1)),
                _createVNode(_component_v_row, null, {
                  default: _withCtx(() => [
                    _createVNode(_component_v_col, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_text_field, {
                          modelValue: config.api_url,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((config.api_url) = $event)),
                          label: "API地址",
                          variant: "outlined",
                          hint: "外部服务API地址",
                          rules: [v => !v || v.startsWith('http') || '请输入有效的URL']
                        }, null, 8, ["modelValue", "rules"])
                      ]),
                      _: 1
                    }),
                    _createVNode(_component_v_col, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_text_field, {
                          modelValue: config.api_key,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((config.api_key) = $event)),
                          label: "API密钥",
                          variant: "outlined",
                          "append-inner-icon": showApiKey.value ? 'mdi-eye-off' : 'mdi-eye',
                          type: showApiKey.value ? 'text' : 'password',
                          "onClick:appendInner": _cache[6] || (_cache[6] = $event => (showApiKey.value = !showApiKey.value))
                        }, null, 8, ["modelValue", "append-inner-icon", "type"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode(_component_v_expansion_panels, { variant: "accordion" }, {
                  default: _withCtx(() => [
                    _createVNode(_component_v_expansion_panel, null, {
                      default: _withCtx(() => [
                        _createVNode(_component_v_expansion_panel_title, null, {
                          default: _withCtx(() => _cache[12] || (_cache[12] = [
                            _createTextVNode("高级选项")
                          ])),
                          _: 1
                        }),
                        _createVNode(_component_v_expansion_panel_text, null, {
                          default: _withCtx(() => [
                            _createVNode(_component_v_slider, {
                              modelValue: config.concurrent_tasks,
                              "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((config.concurrent_tasks) = $event)),
                              label: "并发任务数",
                              min: "1",
                              max: "10",
                              step: "1",
                              "thumb-label": ""
                            }, null, 8, ["modelValue"]),
                            _createVNode(_component_v_combobox, {
                              modelValue: config.tags,
                              "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((config.tags) = $event)),
                              label: "标签",
                              variant: "outlined",
                              chips: "",
                              multiple: "",
                              "closable-chips": ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          _: 1
        }),
        _createVNode(_component_v_card_actions, null, {
          default: _withCtx(() => [
            _createVNode(_component_v_btn, {
              color: "secondary",
              onClick: resetForm
            }, {
              default: _withCtx(() => _cache[16] || (_cache[16] = [
                _createTextVNode("重置")
              ])),
              _: 1
            }),
            _createVNode(_component_v_spacer),
            _createVNode(_component_v_btn, {
              color: "primary",
              disabled: !isFormValid.value,
              onClick: saveConfig,
              loading: saving.value
            }, {
              default: _withCtx(() => _cache[17] || (_cache[17] = [
                _createTextVNode("保存配置")
              ])),
              _: 1
            }, 8, ["disabled", "loading"])
          ]),
          _: 1
        })
      ]),
      _: 1
    })
  ]))
}
}

};

export { _sfc_main as default };
