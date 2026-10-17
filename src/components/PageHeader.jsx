import PropTypes from 'prop-types';

export default function PageHeader({ title, accent, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>
          {title} {accent && <span className="accent">{accent}</span>}
        </h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  accent: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

PageHeader.defaultProps = {
  accent: '',
  subtitle: '',
  children: null,
};
