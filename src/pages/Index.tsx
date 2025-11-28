import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const CATEGORIES = {
  expense: ['Продукты', 'Транспорт', 'Жильё', 'Развлечения', 'Здоровье', 'Образование', 'Одежда', 'Прочее'],
  income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарки', 'Прочее']
};

function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 85000, category: 'Зарплата', description: 'Основная работа', date: '2025-11-01' },
    { id: '2', type: 'expense', amount: 4500, category: 'Продукты', description: 'Супермаркет', date: '2025-11-05' },
    { id: '3', type: 'expense', amount: 2800, category: 'Транспорт', description: 'Проездной', date: '2025-11-07' },
    { id: '4', type: 'expense', amount: 25000, category: 'Жильё', description: 'Аренда квартиры', date: '2025-11-10' },
    { id: '5', type: 'income', amount: 15000, category: 'Фриланс', description: 'Проект дизайна', date: '2025-11-12' },
    { id: '6', type: 'expense', amount: 3200, category: 'Развлечения', description: 'Кино и кафе', date: '2025-11-15' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const monthlyData = useMemo(() => {
    const months = ['Сентябрь', 'Октябрь', 'Ноябрь'];
    const data = [];

    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(2025, 8 + i, 1);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear();
      });

      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: months[i],
        Доходы: monthIncome,
        Расходы: monthExpense,
        Баланс: monthIncome - monthExpense
      });
    }

    return data;
  }, [transactions]);

  const categoryChartData = useMemo(() => {
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
  }, [expensesByCategory]);

  const COLORS = ['hsl(199, 89%, 48%)', 'hsl(215, 25%, 15%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)', 'hsl(280, 65%, 60%)'];

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <Icon name="Wallet" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ФинансАссистент</h1>
                <p className="text-sm text-muted-foreground">Умное управление финансами</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 gradient-primary shadow-lg hover:shadow-xl transition-all">
                  <Icon name="Plus" size={20} />
                  Добавить операцию
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая операция</DialogTitle>
                  <DialogDescription>Добавьте доход или расход</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as 'income' | 'expense')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="expense">Расход</TabsTrigger>
                      <TabsTrigger value="income">Доход</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES[transactionType].map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Input
                      id="description"
                      placeholder="Комментарий"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Дата</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddTransaction} className="w-full">
                    Добавить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Баланс</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Icon name="TrendingUp" size={16} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{balance.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">Текущий остаток</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доходы</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                <Icon name="ArrowUpRight" size={16} className="text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{totalIncome.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий период</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Расходы</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                <Icon name="ArrowDownRight" size={16} className="text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{totalExpense.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий период</p>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-scale-in col-span-full mb-8">
          <CardHeader>
            <CardTitle>Динамика доходов и расходов</CardTitle>
            <CardDescription>График изменения финансов по месяцам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(215, 15%, 50%)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(215, 15%, 50%)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}к`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(214, 20%, 90%)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Доходы" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(142, 71%, 45%)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Расходы" 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(0, 84%, 60%)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Баланс" 
                  stroke="hsl(199, 89%, 48%)" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(199, 89%, 48%)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Расходы по категориям</CardTitle>
              <CardDescription>Распределение трат</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Финансовый обзор</CardTitle>
              <CardDescription>Анализ за текущий месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <Icon name="TrendingUp" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Норма сбережений</p>
                      <p className="text-xs text-muted-foreground">От дохода</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">
                      {((balance / totalIncome) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon name="Receipt" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Операций</p>
                      <p className="text-xs text-muted-foreground">Всего записей</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <Icon name="Calendar" size={20} className="text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Средний расход</p>
                      <p className="text-xs text-muted-foreground">В день</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {(totalExpense / 28).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Последние операции</CardTitle>
            <CardDescription>История транзакций</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          <Icon 
                            name={transaction.type === 'income' ? 'ArrowUpRight' : 'ArrowDownRight'} 
                            size={12} 
                            className={transaction.type === 'income' ? 'text-success' : 'text-destructive'}
                          />
                        </div>
                        {transaction.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.description || '—'}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'income' ? '+' : '−'}
                      {transaction.amount.toLocaleString('ru-RU')} ₽
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Index;