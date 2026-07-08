const PageHeader = ({ title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
    </div>
    {action}
  </div>
);

export default PageHeader;
