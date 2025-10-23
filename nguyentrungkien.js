// ====== Utility ======
function el(id){ return document.getElementById(id); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

// ====== State ======
let currentPage = 1;
let pageSize = parseInt(document.getElementById('pageSize').value || 10);
let lastQuery = "";

const resultsEl = el('results');
const statusEl = el('status');
const pagerEl = el('pager');
const pageInfoEl = el('pageInfo');
const prevBtn = el('prevPage');
const nextBtn = el('nextPage');

// ====== Render Results ======
function renderResults(data){
  resultsEl.innerHTML = '';
  if(!data || data.length === 0){
    statusEl.textContent = 'Không có kết quả phù hợp.';
    pagerEl.style.display = 'none';
    return;
  }

  statusEl.textContent = `Tìm thấy ${data.length} kết quả (hiển thị trang ${currentPage}).`;

  // Paginate client-side
  const start = (currentPage - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  pageData.forEach(row => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="left">
        <h3>${escapeHtml(row.FullName)} 
          <small style="color:#888;font-size:12px">#${row.StudentID}</small>
        </h3>
        <p><strong>Email:</strong> ${escapeHtml(row.Email || '')}</p>
        <p><strong>Ngành:</strong> ${escapeHtml(row.Major || '')} — 
           <strong>Khoá:</strong> ${escapeHtml(row.Year || '')}</p>
      </div>
      <div class="actions">
        <button class="edit" data-id="${row.StudentID}">Sửa</button>
        <button class="del" data-id="${row.StudentID}">Xóa</button>
      </div>
    `;
    resultsEl.appendChild(div);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  pageInfoEl.textContent = `${currentPage} / ${totalPages}`;
  pagerEl.style.display = totalPages > 1 ? 'flex' : 'none';
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  // Event handlers
  document.querySelectorAll('.edit').forEach(b => b.addEventListener('click', onEditClick));
  document.querySelectorAll('.del').forEach(b => b.addEventListener('click', onDeleteClick));
}

// ====== Loading UI ======
function showLoading(msg){
  statusEl.textContent = msg || 'Đang xử lý...';
  resultsEl.innerHTML = '';
  pagerEl.style.display = 'none';
}

// ====== Fetch search ======
async function doSearch(q){
  q = q.trim();
  lastQuery = q;
  currentPage = 1;
  pageSize = parseInt(document.getElementById('pageSize').value || 10);

  // Nếu chưa nhập gì → không tìm
  if(!q){
    statusEl.textContent = "⚠️ Hãy nhập tên hoặc email để tìm sinh viên.";
    resultsEl.innerHTML = '';
    pagerEl.style.display = 'none';
    return;
  }

  showLoading('Đang tìm...');
  try {
    const res = await fetch(`/api/timkiem?q=${encodeURIComponent(q)}`);
    if(!res.ok) throw new Error('Server trả lỗi: ' + res.status);
    const json = await res.json();
    if(json.status === 'success'){
      renderResults(json.data || []);
      window._lastResults = json.data || [];
    } else if(json.status === 'empty'){
      statusEl.textContent = "⚠️ Hãy nhập từ khóa tìm kiếm.";
    } else {
      statusEl.textContent = json.message || 'Không có kết quả.';
    }
  } catch(err){
    statusEl.textContent = 'Lỗi khi gọi API: ' + err.message;
  }
}

// ====== Add new student ======
document.getElementById('addForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = {
    FullName: fd.get('FullName'),
    Email: fd.get('Email'),
    Major: fd.get('Major'),
    Year: fd.get('Year') ? Number(fd.get('Year')) : null
  };
  try {
    const res = await fetch('/api/them', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const j = await res.json();
    if(j.status === 'success'){
      alert('Thêm thành công (ID = '+j.id+')');
      e.target.reset();
      if(lastQuery) doSearch(lastQuery);
    } else {
      alert('Lỗi: '+(j.message || 'Không thành công'));
    }
  } catch(err){
    alert('Lỗi khi gọi API thêm: '+err.message);
  }
});

// ====== Edit modal ======
const editModal = el('editModal');
const editForm = el('editForm');

function openEditModal(row){
  editModal.setAttribute('aria-hidden','false');
  editForm.StudentID.value = row.StudentID;
  editForm.FullName.value = row.FullName || '';
  editForm.Email.value = row.Email || '';
  editForm.Major.value = row.Major || '';
  editForm.Year.value = row.Year || '';
}
function closeEditModal(){ editModal.setAttribute('aria-hidden','true'); }

editForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = {
    StudentID: Number(fd.get('StudentID')),
    FullName: fd.get('FullName'),
    Email: fd.get('Email'),
    Major: fd.get('Major'),
    Year: fd.get('Year') ? Number(fd.get('Year')) : null
  };
  try {
    const res = await fetch('/api/sua', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const j = await res.json();
    if(j.status === 'success'){
      alert('Cập nhật thành công');
      closeEditModal();
      if(lastQuery) doSearch(lastQuery);
    } else {
      alert('Lỗi: '+(j.message || 'Không thành công'));
    }
  } catch(err){
    alert('Lỗi khi gọi API sửa: '+err.message);
  }
});

el('cancelEdit').addEventListener('click', closeEditModal);

// ====== Delete handler ======
async function onDeleteClick(e){
  const id = e.currentTarget.dataset.id;
  if(!confirm('Bạn có chắc muốn xóa ID = '+id+' không?')) return;
  try {
    const res = await fetch(`/api/xoa?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const j = await res.json();
    if(j.status === 'success'){
      alert('Xóa thành công');
      if(lastQuery) doSearch(lastQuery);
    } else {
      alert('Lỗi: '+(j.message || 'Không thành công'));
    }
  } catch(err){
    alert('Lỗi khi gọi API xóa: '+err.message);
  }
}

// ====== Pagination ======
prevBtn.addEventListener('click', function(){ 
  if(currentPage > 1){ 
    currentPage--; 
    renderResults(window._lastResults || []); 
  }
});
nextBtn.addEventListener('click', function(){ 
  const total = Math.ceil((window._lastResults || []).length / pageSize); 
  if(currentPage < total){ 
    currentPage++; 
    renderResults(window._lastResults || []); 
  }
});

// ====== Buttons ======
el('btnSearch').addEventListener('click', function(){ 
  const q = el('q').value.trim(); 
  doSearch(q); 
});
el('btnRefresh').addEventListener('click', function(){ 
  el('q').value=''; 
  statusEl.textContent=''; 
  resultsEl.innerHTML=''; 
  pagerEl.style.display='none';
});
el('clearForm').addEventListener('click', function(){ 
  document.getElementById('addForm').reset(); 
});

// ❌ Bỏ dòng này để không tự load khi mở trang
// doSearch('');
