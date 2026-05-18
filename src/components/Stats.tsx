const stats = [
  { value: "1,200+", label: "Biznese të regjistruara" },
  { value: "3,500+", label: "Listime aktive" },
  { value: "30+", label: "Komuna të mbuluara" },
  { value: "€2M+", label: "Transaksione mujore" },
];

const Stats = () => {
  return (
    <section className="py-16 bg-background md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="group rounded-lg border border-border bg-gradient-to-br from-card to-card/50 p-4 text-center hover:shadow-md transition-all sm:p-5 md:rounded-xl md:p-6">
              <div className="mb-2 text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:mb-3 sm:text-4xl md:text-5xl">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
