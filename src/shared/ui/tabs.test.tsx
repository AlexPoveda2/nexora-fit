import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function LevelTabs() {
  return (
    <Tabs defaultValue="basico">
      <TabsList className="w-full">
        <TabsTrigger value="basico">Básico</TabsTrigger>
        <TabsTrigger value="intermedio">Intermedio</TabsTrigger>
      </TabsList>
      <TabsContent value="basico">4 semanas · 3 días</TabsContent>
      <TabsContent value="intermedio">4 semanas · 4 días</TabsContent>
    </Tabs>
  );
}

it("cambia de pestaña con el clic y con las flechas", async () => {
  const user = userEvent.setup();
  render(<LevelTabs />);

  expect(screen.getByRole("tab", { name: "Básico" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("4 semanas · 3 días");

  await user.click(screen.getByRole("tab", { name: "Intermedio" }));
  expect(screen.getByRole("tab", { name: "Intermedio" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("4 semanas · 4 días");

  await user.keyboard("{ArrowLeft}");
  expect(screen.getByRole("tab", { name: "Básico" })).toHaveAttribute("aria-selected", "true");
});

it("cada pestaña es un objetivo táctil de 44 px y la activa va en primary, nunca en rojo", () => {
  render(<LevelTabs />);

  for (const tab of screen.getAllByRole("tab")) {
    expect(tab.className).toContain("min-h-11");
    expect(tab.className).toContain("data-active:bg-primary");
    expect(tab.className).not.toMatch(/\bbg-cta\b/);
  }
  expect(screen.getByRole("tablist").className).not.toContain("h-8");
});
