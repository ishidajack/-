'use strict'


{
  document.addEventListener('DOMContentLoaded', () => {
    //iプログラム作成時常に白紙に戻す
    localStorage.removeItem('attendanceRecords');  
    

    // DOM
  const dateSelect = document.getElementById("date-selector");
  const tbody = document.getElementById("student-table");
  const acc = document.getElementById("menu-toggle");
  const panel = document.getElementById("menu-panel");
  const icon = acc.querySelector('.material-symbols-outlined');
  const menuBtn = document.getElementById("menu-toggle");
   const menuPanel = document.getElementById("menu-panel");
    const menuIcon = menuBtn.querySelector("material-symbol-outlined");

    menuBtn.addEventListener("click", () => {
      menuPanel.classList.toggle("hidden");
      menuIcon.textContent = menuPanel.classList.contains("hidden") ? "menu" : close;
    })

    const section = ["menu-view", "attendance-view", "test-result-view"];
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        section.forEach(id => {
          document.getElementById(id).classList.add("hidden");
          menuPanel.classList.add("hidden");
        });

        document.getElementById(target).classList.remove("hidden");
        menuPanel.classList.add("hidden");
        menuIcon.textContent = "menu";
      })
    })

    document.querySelectorAll('.menu-item').forEach (button=> {
      button.addEventListener('click', () => {
        const targetId = button.dataset.target;

        document.querySelectorAll('.view-section').forEach(section => {
          section.classList.add("hidden");
        });

        const targetSection = document.getElementById(targetId);
        if(targetSection) {
          targetSection.classList.remove("hidden");
        }

        menuPanel.classList.add("hidden");
        menuIcon.textContent = "menu"
      
      });
    });

// HTMLの一部が欠けてもすぐ原因がわかるようになる
 if (!acc || !panel || !icon) {
  console.error("要素が取得できていません", { acc, panel, icon });
  return;
}




  // 永続化キー＆データ
  const recordsKey ='attendanceRecords';
  const records =JSON.parse(localStorage.getItem(recordsKey) || '{}');
  let currentDate = dateSelect.value;



// データ生徒の名簿
  const students = ["あんぱんまん","いしだかずき","おきたそうごう","かつらこたろう","かぐら","こんどういさお","さかたぎんとき","さかもとりょうま","しむらしんぱち","たかすぎしんすけ","ちんこたろう","なりたりょう","にいじまゆう","ねこひろし","のだなつみ","はたおうじ","はんだごて","まつだいらかたくりこ","まんびらこ","やぎゅうきゅうべい"];

  students.sort((a,b) => a.localeCompare(b, "ja"));

  function generateBlankedData() {
    const data = {};
    students.forEach(name => {
      data[name] = {
        attendance: '出席',
        skills: '',
        speaking: '',
        reading: ''
      };
    });
    return data;
  }

  // ローカルストレージに保存
  function saveRecords() {
    localStorage.setItem(recordsKey, JSON.stringify(records));
  }


  // 現在のテーブル内容を records に保存
  function saveCurrentTableData() {
    records[currentDate] = records[currentDate] || {};
    tbody.querySelectorAll('tr[data-name]').forEach(row => {
      const name = row.dataset.name;
      const [attSel, sklSel, lisSel, spkSel] = row.querySelectorAll('select');
      records[currentDate][name] = {
        attendance: attSel.value,
        skills: sklSel.value,
        listening: lisSel.value,
        speaking: spkSel.value
      };
    });
    saveRecords();
  }


  // テーブル描画
  function renderTableForDate(date) {
    tbody.innerHTML = '';
    currentDate = date;

    // 日付ごとのデータ取得 or 新規生成
    const dailyData = records[date] || generateBlankedData();




  const groups = {
    ア:[],
    カ:[],
    サ:[],
    タ:[],
    ナ:[],
    ハ:[],
    マ:[],
    ヤ:[],
    ラ:[],
    ワ:[],

  };


  //  グルー分け
  students.forEach(name => {
    const firstKana = name[0];
    let groupkey = null;

    if ("あいうえおアイウエオ".includes(firstKana)){
      groupkey ="ア";
    } else if ("かきくけこカキクケコ".includes(firstKana)){
      groupkey ="カ";
    } else if ("さしすせそサシスセソ".includes(firstKana)){
      groupkey ="サ";
    } else if ("たちつてとタチツテト".includes(firstKana)){
      groupkey ="タ";
    } else if ("なにぬねのナニヌネノ".includes(firstKana)){
      groupkey ="ナ";
    } else if ("はひふへほハヒフヘホ".includes(firstKana)){
      groupkey ="ハ";
    } else if ("まみむめもマミムメモ".includes(firstKana)){
      groupkey ="マ";
    } else if ("やゆよヤユヨ".includes(firstKana)){
      groupkey ="ヤ";

    }

    if (groupkey) 
      groups[groupkey].push(name);
    
  });

  

  // const buttons = document.querySelectorAll("#date-butt button");

  // buttons.forEach(button => {
  //   button.addEventListener("click", () =>{
  //     const date = button.dateset.date;
  //     renderTableFordate(date);
  //     });
  // });

 
  for (const groupName in groups) {
    const list = groups[groupName];
    if (!list.length) continue;  
  // 見出し行
 tbody.insertAdjacentHTML('beforeend', `<tr><td colspan="5">${groupName}行(${date})
  </td></tr>` );

// 名前行
 list.forEach(name => {
  const studentData = dailyData[name] || { attendance: '出席', skills: '', listening: '', speaking: '' };
  tbody.insertAdjacentHTML('beforeend',
    `<tr data-name="${name}">
      <td> ${name} </td>

      <td>
        <select>
        <option ${studentData.attendance === '出席' ? 'selected' : ''}>出席</option>
        <option ${studentData.attendance === '欠席' ? 'selected' : ''}>欠席</option>
        <option ${studentData.attendance === '遅刻' ? 'selected' : ''}>遅刻</option>
        <option ${studentData.attendance === '公欠' ? 'selected' : ''}>公欠</option>
       

        </select>
      </td>

      <td>
        <select>
         <option value="" disabled ${studentData.skills === '' ? 'selected' : ''}></option>
        <option value="A" ${studentData.skills === 'A' ? 'selected' : ''}>A</option>
        <option value="B" ${studentData.skills === 'B' ? 'selected' : ''}>B</option>
        <option value="C" ${studentData.skills === 'C' ? 'selected' : ''}>C</option>
        </select>
      </td>

       <td>
        <select>
         <option value="" ${studentData.listening === ''  ? 'selected' : ''}></option>
        <option value="A" ${studentData.listening === 'A' ? 'selected' : ''}>A</option>
        <option value="B" ${studentData.listening === 'B' ? 'selected' : ''}>B</option>
        <option value="C" ${studentData.listening === 'C' ? 'selected' : ''}>C</option>
        </select>
      </td>

       <td>
        <select>
         <option value="" disabled ${studentData.speaking === '' ? 'selected' : ''}></option>
        <option value="A" ${studentData.speaking === 'A' ? 'selected' : ''}>A</option>
        <option value="B" ${studentData.speaking === 'B' ? 'selected' : ''}>B</option>
        <option value="C" ${studentData.speaking === 'C' ? 'selected' : ''}>C</option>
        </select>
      </td>
    </tr>`);

   });
  }


   // 変更時に保存
   tbody.querySelectorAll('select').forEach(sel => { sel.addEventListener('change', saveCurrentTableData)});
    }

  
  





 
  // 初期表示
renderTableForDate(currentDate);

dateSelect.addEventListener("change", e => {
  const newDate = e.target.value;
    saveCurrentTableData();
    currentDate = newDate;
    console.log("変更後 currentDate:", currentDate)
    renderTableForDate(currentDate);
 });

});

}








