<script setup lang="ts">
import { ref, computed } from 'vue'
import { transform } from './util'

const first_date = ref('2025-02-24')

const example_schedule = `上课周次	上课星期	开始节次	结束节次
6-9周	星期三	第8节	第9节
1-11周	星期二	第3节	第4节
8周	星期五	第3节	第5节`
const schedule = ref('')

const month = ref(2)
const date_range = computed<[Date, Date]>(() => [new Date(2025, month.value - 1, 26), new Date(2025, month.value, 25)])

const result = computed(() => transform(date_range.value, schedule.value, new Date(first_date.value)))

function format_date(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}
</script>

<template>
  <main>
    <form>
      <h2>下载课表</h2>
      <ol>
        <li>
          前往<a href="https://jxzxehall.bit.edu.cn/new/index.html?browser=no">北理工本硕博一体化教学系统</a>，访问<a
            href="https://jxzxehallapp.bit.edu.cn/jwapp/sys/wdkbby/*default/index.do#/xskcb">我的课表（本研）</a>。
        </li>
        <li>选择“列表模式 → 导出”。</li>
        <li>选择“导出文件列表 → 下载”。</li>
      </ol>

      然后打开<code>我的课表.xlsx</code>，复制<strong>上课周次、上课星期、开始节次、结束节次</strong>几列，粘贴到下面。

      <label for="schedule">
        <h2>粘贴课表</h2>
        <textarea id="schedule" v-model="schedule" required :placeholder="example_schedule"></textarea>
      </label>

      <label for="month">
        <h2>选择月份</h2>
        <select id="month" required v-model="month">
          <option :value="2">二月</option>
          <option :value="3">三月</option>
          <option :value="4">四月</option>
          <option :value="5">五月</option>
          <option :value="6">六月</option>
        </select>
      </label>
    </form>

    <h2>复制“学生排班表”</h2>
    <p>
      范围：{{ format_date(date_range[0]) }}（含）至{{ format_date(date_range[1]) }}（含）。
    </p>
    <textarea>{{ result }}</textarea>

    <section>
      <h2>补充</h2>
      <ul>
        <li>
          <p>已知的问题：没有考虑“放假或者法节”。</p>
        </li>
        <li>
          <form>
            <label for="date">
              以防万一，你可以手动设置<a href="https://jwb.bit.edu.cn/jxrlsksj/2b85d60cc8fc4ccea17f5c86c01fffb3.htm">教学日历</a>第一周的周一：
              <input type="date" id="date" v-model="first_date" required />
            </label>
          </form>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
a {
  text-decoration: none;
}

textarea {
  width: 80%;
  height: 10em;
}
</style>