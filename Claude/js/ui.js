/**
 * js/ui.js
 * ─────────────────────────────────────────────
 * UI Renderer — Pure functions that return
 * HTML strings from application state.
 * No direct DOM mutations here; the app.js
 * layer injects the returned strings.
 * ─────────────────────────────────────────────
 */

/** Render the stats bar HTML. */
function renderStats({ totalPlaces, totalFavs, totalNotes, userAdded }) {
  const stats = [
    { value: totalPlaces, label: 'إجمالي الأماكن' },
    { value: totalFavs,   label: 'المفضلة'         },
    { value: totalNotes,  label: 'ملاحظاتي'        },
    { value: userAdded,   label: 'أضفتها أنت'      },
  ];
  return stats.map(s => `
    <div class="stat-card">
      <div class="stat-card__value">${s.value}</div>
      <div class="stat-card__label">${s.label}</div>
    </div>
  `).join('');
}

/** Render a single place card. */
function renderPlaceCard(place, isFav, noteText) {
  const userBadge = place.userAdded
    ? `<span class="badge badge--user">مضاف</span>`
    : '';

  return `
    <article class="place-card" data-id="${place.id}">
      <div class="place-card__media" aria-hidden="true">${place.emoji || '📍'}</div>
      <div class="place-card__body">

        <header class="place-card__header">
          <h3 class="place-card__title">${userBadge}${place.name}</h3>
          <button
            class="fav-btn ${isFav ? 'fav-btn--active' : ''}"
            data-id="${place.id}"
            aria-label="${isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}"
            title="${isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}"
          >${isFav ? '⭐' : '☆'}</button>
        </header>

        <span class="badge badge--category">${place.category}</span>
        <p class="place-card__desc">${place.desc}</p>

        <div class="note-label">ملاحظاتي الخاصة</div>
        <textarea
          class="note-textarea"
          id="note-${place.id}"
          data-id="${place.id}"
          placeholder="اكتب ملاحظتك عن هذا المكان…"
          rows="3"
        >${noteText}</textarea>

        <button
          class="btn btn--brand btn--save-note"
          data-save="${place.id}"
          aria-label="حفظ الملاحظة"
        >حفظ الملاحظة</button>

        <div class="note-saved-msg" id="saved-${place.id}">✓ تم الحفظ</div>

      </div>
    </article>
  `;
}

/** Render the full places grid (or empty state). */
function renderPlacesGrid(places, favIds, notesMap, tab) {
  if (places.length === 0) {
    const isSearch = tab === 'search';
    return `
      <div class="empty-state" role="status">
        <span class="empty-state__icon" aria-hidden="true">${tab === 'favorites' ? '⭐' : '🔍'}</span>
        <h3 class="empty-state__title">${tab === 'favorites' ? 'لا توجد أماكن مفضلة بعد' : 'لا توجد نتائج'}</h3>
        <p class="empty-state__desc">${
          tab === 'favorites'
            ? 'اضغط على النجمة ☆ في أي بطاقة لإضافة المكان إلى مفضلتك'
            : 'لم يتطابق بحثك مع أي مكان، حاول كلمة مختلفة'
        }</p>
      </div>`;
  }

  const cards = places.map(p =>
    renderPlaceCard(p, favIds.has(p.id), notesMap[p.id] || '')
  ).join('');

  return `<div class="places-grid" role="list">${cards}</div>`;
}

/** Render the Add Place form. */
function renderAddForm() {
  const options = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  return `
    <section class="add-section" aria-label="إضافة مكان سياحي جديد">
      <div class="form-card">
        <h2 class="form-card__title">إضافة مكان جديد</h2>

        <div class="form-group">
          <label class="form-label" for="f-name">اسم المكان <span>*</span></label>
          <input
            class="form-input"
            id="f-name"
            type="text"
            placeholder="مثال: مسجد بلال"
            autocomplete="off"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="f-cat">الفئة</label>
          <select class="form-select" id="f-cat">${options}</select>
        </div>

        <div class="form-group">
          <label class="form-label" for="f-desc">وصف المكان</label>
          <textarea
            class="form-textarea"
            id="f-desc"
            placeholder="اكتب وصفاً مختصراً للمكان…"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="f-emoji">رمز تعبيري</label>
          <div class="form-row">
            <input class="form-input" id="f-emoji" type="text" placeholder="📍" maxlength="4" />
          </div>
        </div>

        <button class="btn btn--brand btn--full" id="submitAddBtn">
          حفظ المكان الجديد
        </button>
        <p class="form-error" id="add-err" role="alert">⚠ يرجى إدخال اسم المكان</p>
      </div>
    </section>`;
}
