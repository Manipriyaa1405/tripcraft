import PropTypes from 'prop-types';

export default function CategoryChips({ categories, active, onChange }) {
  return (
    <div className="chips" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={cat === active}
          className={`chip${cat === active ? ' active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

CategoryChips.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
