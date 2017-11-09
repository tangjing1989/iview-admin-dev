<template>
        <Row>
            <Col span="20">
            <Card>
                <Row>
                    <Card dis-hover>
                        <p slot="title">
                            <Icon type="ios-list-outline"></Icon>
                            Layer 1  *NEW*
                        </p>
                        <div>
                            <Row>
                                <Col span="8">
                                <Card dis-hover>
                                    <p slot="title">
                                        Step 1 : Add users
                                    </p>
                                   <row   v-for="todo in todos" v-bind:key="todo" >
                                     <userSel @addUserSel=addUserSel></userSel>
                                   </row>
                                </Card>
                                </Col>
                                <Col span="8" class="padding-left-10">
                                <Card dis-hover>
                                    <p slot="title">
                                        Step 2 : Set up an on-call rotation
                                    </p>
                                    <Form ref="formInline" :label-width="100">
                                        <FormItem label="Rotation type">
                                            <Select size="small" style="width:150px" @on-change="changeSelect">
                                                <Option v-for="item in typeList" :value="item.value" :key="item.value">
                                                    {{ item.label }}
                                                </Option>
                                            </Select>
                                        </FormItem>

                                        <component v-bind:is="which_to_show">
                                        </component>

                                    </Form>
                                    <Form>
                                        <FormItem>
                                            <CheckboxGroup>
                                                <Checkbox label="Restrict on-call shifts to specific times"></Checkbox>
                                            </CheckboxGroup>
                                        </FormItem>
                                    </Form>
                                </Card>
                                </Col>
                                <Col span="8" class="padding-left-10">
                                <Card dis-hover>
                                    <p slot="title">
                                        Step 3 : Start time for this layer
                                    </p>

                                </Card>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Row>
            </Card>
            </Col>
            <Col span="4" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="ios-paper-outline"></Icon>
                    本周已选任务清单
                </p>
                <div style="height: 394px;">
                </div>
            </Card>
            </Col>
        </Row>
</template>
<script>
    export default {
        data() {
            return {
                typeList:[{value: "daily", label: "daily"},
                        {value: "weekly", label: "weekly"},
                        {value: "custom", label: "custom"}
                    ],
                which_to_show: "daily",
                model10: [],
                userSel: "userSel",
                todos: 1
                
            };
        },

        methods: {
            changeSelect: function (val) {   //切换组件显示
                this.which_to_show = val;
            },
            addUserSel:function (){
                this.todos++
            }
        },
        components: {
            userSel: {
                data () {
                    return {
                        cityList: [
                            {value: '1', label: 'New York'},
                            {value: '2', label: 'London'},
                            {value: '3', label: 'Sydney'},
                            {value: '4', label: 'Ottawa'},
                            {value: '5', label: 'Paris'},
                            {value: '6', label: 'Canberra'}
                        ]
                    }
                },
                template: "<row style='margin-bottom: 12px'><Select size=\"small\" style=\"width:200px\" @on-change='addUserSel' >" +
                "                                        <Option v-for=\"item in cityList\" :value=\"item.value\" :key=\"item.value\">" +
                "                                            {{ item.label }}" +
                "                                        </Option>" +
                "                                    </Select>"+
                "<Icon style='margin-left: 6px' type='android-delete'></Icon>"+
                "</row>",
                methods: {
                    addUserSel: function (obj) {
                       this.$emit('addUserSel');
                    }
                },
            },
            daily: { //layer 日模板
                template: " <FormItem label=\"Rotation type\"><TimePicker format=\"HH:mm\" size=\"small\" style=\"width:150px\" type=\"time\" ></TimePicker></FormItem>"
            },
            weekly: { //layer 周模板
                template: "<FormItem label=\"Rotation type\">" +
                " <Select size=\"small\" style=\"width:105px\" > " +
                "               <Option v-for=\"item in weekList\" :value=\"item.value\" :key=\"item.value\">\n" +
                "                  {{ item.label }}\n" +
                "                </Option>" +
                "           </Select>" +
                "<TimePicker   format=\"HH:mm\" size=\"small\"  style=\"width:80px ; margin-left: 6px \">" +
                "</TimePicker>" +
                "</FormItem>",
                data: function () {
                    return {
                        weekList: [
                            {value: "7", label: "Sun"},
                            {value: "1", label: "Mon"},
                            {value: "2", label: "Tue"},
                            {value: "3", label: "sel"},
                            {value: "4", label: "Thu"},
                            {value: "5", label: "Fri"},
                            {value: "6", label: "Sat"}
                        ],
                    }
                }

            },
            custom: { //layer 自定义模板
                template: "<div><FormItem label=\"Shift length\">" +
                "<Input  size=\"small\"  style=\"width:105px\"></Input>" +
                " <Select size=\"small\" style=\"width:80px ;margin-left: 2px\" > " +
                "               <Option v-for=\"item in customtypeList\" :value=\"item.value\" :key=\"item.value\">\n" +
                "                  {{ item.label }}\n" +
                "                </Option>" +
                "           </Select>" +
                "</FormItem>" +
                "<FormItem label=\"Handoff time\">" +
                "<DatePicker type=\"date\" format='yyyy/MM/dd' size='small' style=\"width: 105px\"></DatePicker>" +
                "<TimePicker format=\"HH:mm\" size='small' style=\"width: 80px; margin-left: 6px  \"></TimePicker>" +
                "</FormItem></div>",
                data: function () {
                    return {
                        customtypeList: [
                            {value: "Hours", label: "Hours"},
                            {value: "Days", label: "Days"},
                            {value: "Weeks", label: "Weeks"}
                        ],
                    }
                }
            },
        }
    }
</script>
