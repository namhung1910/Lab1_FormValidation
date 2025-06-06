document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const fields = [
    {id: 'name', validator: v => v.trim() ? null : 'Họ và tên không được để trống'},
    {id: 'email', validator: v => !v.trim() ? 'Email không được để trống' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email không hợp lệ')},
    {id: 'tel', validator: v => !v.trim() ? 'Số điện thoại không được để trống' : (/^\d{10,11}$/.test(v) ? null : 'Số điện thoại phải có 10-11 chữ số')},
    {id: 'address', validator: v => v.trim() ? null : 'Địa chỉ không được để trống'},
    {id: 'date', validator: v => v ? null : 'Ngày sinh không được để trống'}
  ];
  const genderName = 'gender';
  const extras = ['QuaTrinhHoc', 'SoThich'];

  // --- Tạo span lỗi cho mỗi field ---
  [...fields, {id: genderName}].forEach(f => {
    const container = f.id === genderName
      ? document.querySelector(`input[name="${genderName}"]`).parentNode
      : document.getElementById(f.id);
    const span = document.createElement('span');
    span.className = 'error-message';
    span.style.cssText = 'color:red;font-size:.85rem;display:none;margin-top:4px';
    container.insertAdjacentElement('afterend', span);
  });

  // --- Hiển thị hoặc ẩn lỗi ---
  const showError = (el, msg) => {
    const span = el === genderName
      ? document.querySelector('.error-message:last-of-type')
      : document.getElementById(el).nextElementSibling;
    span.textContent = msg || '';
    span.style.display = msg ? 'block' : 'none';
    if (el !== genderName) {
      document.getElementById(el).setAttribute('aria-invalid', !!msg);
    }
  };

  // --- Validate một field cụ thể ---
  const validate = id => {
    let error = null;
    if (id === genderName) {
      error = [...document.querySelectorAll(`input[name="${genderName}"]`)]
                .some(r => r.checked)
              ? null : 'Vui lòng chọn giới tính';
    } else {
      const val = document.getElementById(id).value;
      error = fields.find(f => f.id === id).validator(val);
    }
    showError(id, error);
    return !error;
  };

  // --- Bắt sự kiện real-time + blur ---
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    el.addEventListener('input', () => validate(f.id));  // chạy khi nhập
    el.addEventListener('blur', () => validate(f.id));   // chạy khi rời trường
  });
  document.querySelectorAll(`input[name="${genderName}"]`).forEach(r => {
    r.addEventListener('change', () => validate(genderName));
  });

  // --- Xử lý submit: validate tất cả ---
  form.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;

    // Validate từng field và radio gender
    fields.forEach(f => {
      if (!validate(f.id)) allValid = false;
    });
    if (!validate(genderName)) allValid = false;

    if (!allValid) {
      // Optional: focus vào trường lỗi đầu tiên
      const firstError = form.querySelector('[aria-invalid="true"], .error-message[style*="display: block"]');
      if (firstError) {
        const input = firstError.previousElementSibling || firstError;
        input.focus();
      }
      return; // dừng submit, lỗi đã hiển thị hết
    }

    // Nếu tất cả valid thì thu thập data
    const data = fields.reduce((acc, f) => {
      acc[f.id] = document.getElementById(f.id).value.trim();
      return acc;
    }, {});
    data.gender = document.querySelector(`input[name="${genderName}"]:checked`).value;
    extras.forEach(id => {
      data[id.toLowerCase()] = document.getElementById(id).value.trim();
    });

    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.removeItem('userData');
    alert(`Thông tin của ${data.name} đã được lưu thành công!`);
  });
});
