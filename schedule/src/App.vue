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

const result = computed(() => transform(
  date_range.value, schedule.value,
  // Use local time zone. Otherwise, it would be the UTC midnight.
  new Date(first_date.value + 'T00:00')))

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
          <option :value="7">七月</option>
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
        <li>
          <p>数据安全：打开网页只是下载了程序，程序在你本地的浏览器运行，数据并未离开你的计算机。事实上，网页完成加载后，你可以直接断开互联网，然后再操作数据。</p>
        </li>
      </ul>
    </section>
  </main>

  <footer>
    <a href="https://github.com/YDX-2147483647/tributary">
      <!-- https://simpleicons.org/?q=git CC-BY-3.0 -->
      <svg class="icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Git</title>
        <path
          d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" />
      </svg>
      YDX-2147483647/tributary
    </a>
  </footer>
</template>

<style scoped>
main {
  max-width: 40em;
  margin: auto;
  padding: 1em;
}

footer {
  text-align: center;
  padding: 1em;
}

a {
  text-decoration: none;
}

textarea {
  width: 100%;
  height: 10em;
}

.icon {
  height: 1em;
  vertical-align: middle;
}
</style>
