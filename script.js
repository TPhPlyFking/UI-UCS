const DICH = '123456780';
const CHI_PHI = { U: 1, D: 1, L: 2, R: 2 };
function tim_o_trong(bang) {
  return bang.indexOf('0');
}
function la_dich(bang) {
  return bang === DICH;
}
function cac_huong_di(bang) {
  const vi_tri = tim_o_trong(bang);
  const hang = Math.floor(vi_tri / 3);
  const cot = vi_tri % 3;
  const ds = [];
  if (hang > 0) ds.push('U');
  if (hang < 2) ds.push('D');
  if (cot > 0) ds.push('L');
  if (cot < 2) ds.push('R');
  return ds;
}
function di_chuyen(bang, huong) {
  const vi_tri = tim_o_trong(bang);
  let vi_tri_moi;
  if (huong === 'U') vi_tri_moi = vi_tri - 3;
  else if (huong === 'D') vi_tri_moi = vi_tri + 3;
  else if (huong === 'L') vi_tri_moi = vi_tri - 1;
  else vi_tri_moi = vi_tri + 1;
  const ds = bang.split('');
  const so_bi_doi = ds[vi_tri_moi];
  ds[vi_tri_moi] = '0';
  ds[vi_tri] = so_bi_doi;
  return ds.join('');
}
function tim_trong_frontier(bang, frontier) {
  for (let i = 0; i < frontier.length; i++) {
    if (frontier[i][0] === bang) return i;
  }
  return -1;
}
function tim_re_nhat(frontier) {
  let vi_tri_re = 0;
  for (let i = 1; i < frontier.length; i++) {
    if (frontier[i][2] < frontier[vi_tri_re][2]) vi_tri_re = i;
  }
  return vi_tri_re;
}
let frontier, explored, hien_tai, xong;

function reset() {
  const bang_dau = document.getElementById('start').value;
  frontier = [[bang_dau, [], 0]];
  explored = [];
  hien_tai = [bang_dau, [], 0];
  xong = false;
  document.getElementById('log').textContent = '';
  document.getElementById('result').textContent = '-';
  ve();
}

function step() {
  if (xong) return;
  if (frontier.length === 0) {
    xong = true;
    document.getElementById('result').textContent = 'Không tìm thấy lời giải';
    return;
  }
  const i = tim_re_nhat(frontier);
  const phan_tu = frontier.splice(i, 1)[0];
  const bang = phan_tu[0];
  const duong_di = phan_tu[1];
  const chi_phi = phan_tu[2];
  hien_tai = phan_tu;
  ghi('Lấy ' + bang + ' (chi phí ' + chi_phi + ')');
  if (la_dich(bang)) {
    xong = true;
    document.getElementById('result').textContent = duong_di.join(' -> ') + ' | ' + duong_di.length + ' bước | tổng chi phí ' + chi_phi;
    ghi('ĐÍCH');
    ve();
    return;
  }

  explored.push(bang);
  for (const huong of cac_huong_di(bang)) {
    const bang_con = di_chuyen(bang, huong);
    const chi_phi_con = chi_phi + CHI_PHI[huong];
    const duong_con = duong_di.concat([huong]);

    const vi_tri = tim_trong_frontier(bang_con, frontier);
    if (!explored.includes(bang_con) && vi_tri === -1) {
      frontier.push([bang_con, duong_con, chi_phi_con]);
      ghi('  ' + huong + ' -> ' + bang_con + ' (chi phí ' + chi_phi_con + ') thêm');
    } else if (vi_tri !== -1 && frontier[vi_tri][2] > chi_phi_con) {
      frontier[vi_tri] = [bang_con, duong_con, chi_phi_con];
      ghi('  ' + huong + ' -> ' + bang_con + ' (chi phí ' + chi_phi_con + ') thay');
    }
  }
  ve();
}

function chay_het() {
  while (!xong) step();
}
function ghi(chu) {
  const log = document.getElementById('log');
  log.textContent += chu + '\n';
  log.scrollTop = log.scrollHeight;
}

function ve() {
  const b = hien_tai[0];
  let html = '';
  for (let r = 0; r < 3; r++) {
    html += '<tr>';
    for (let c = 0; c < 3; c++) {
      const so = b[r * 3 + c];
      html += '<td>' + (so === '0' ? '' : so) + '</td>';
    }
    html += '</tr>';
  }
  document.getElementById('board').innerHTML = html;
  document.getElementById('now').textContent = hien_tai[0];
  document.getElementById('cost').textContent = hien_tai[2];
  document.getElementById('nExplored').textContent = explored.length;
  document.getElementById('nFrontier').textContent = frontier.length;

  const ds = frontier.slice().sort((a, b) => a[2] - b[2]);
  document.getElementById('frontier').textContent = ds.slice(0, 30).map(x => x[0] + '  chi phí=' + x[2]).join('\n');
}

document.getElementById('btnStep').onclick = step;
document.getElementById('btnRun').onclick = chay_het;
document.getElementById('btnReset').onclick = reset;
document.getElementById('btnApply').onclick = function () {
  const v = document.getElementById('start').value;
  if (!/^[0-8]{9}$/.test(v) || new Set(v).size !== 9) { alert('Nhập 9 chữ số khác nhau từ 0 đến 8'); return; }
  reset();
};
reset();
