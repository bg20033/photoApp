import {
  Users,
  Share2,
  CreditCard,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
  dataUsedGB: number;
  dataLimitGB: number;
  shares: number;
  monthlySpend: number;
  status: "active" | "paused" | "trial";
};

const COLORS = ["#6366F1", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const sampleUsers: User[] = [
  {
    id: "u_001",
    name: "Ava Rodriguez",
    email: "ava@example.com",
    plan: "Pro",
    dataUsedGB: 75,
    dataLimitGB: 100,
    shares: 42,
    monthlySpend: 79,
    status: "active",
  },
  {
    id: "u_002",
    name: "Liam Johnson",
    email: "liam@example.com",
    plan: "Starter",
    dataUsedGB: 18,
    dataLimitGB: 25,
    shares: 5,
    monthlySpend: 9,
    status: "active",
  },
  {
    id: "u_003",
    name: "Sophia Nguyen",
    email: "sophia@example.com",
    plan: "Business",
    dataUsedGB: 220,
    dataLimitGB: 250,
    shares: 120,
    monthlySpend: 249,
    status: "paused",
  },
  {
    id: "u_004",
    name: "Ethan Brown",
    email: "ethan@example.com",
    plan: "Pro",
    dataUsedGB: 56,
    dataLimitGB: 100,
    shares: 32,
    monthlySpend: 79,
    status: "trial",
  },
  {
    id: "u_005",
    name: "Mia Davis",
    email: "mia@example.com",
    plan: "Starter",
    dataUsedGB: 24,
    dataLimitGB: 25,
    shares: 8,
    monthlySpend: 9,
    status: "active",
  },
];

const finances = [
  { month: "Jan", revenue: 4200, expenses: 2300 },
  { month: "Feb", revenue: 4800, expenses: 2100 },
  { month: "Mar", revenue: 5300, expenses: 2500 },
  { month: "Apr", revenue: 6000, expenses: 2800 },
  { month: "May", revenue: 6500, expenses: 3000 },
  { month: "Jun", revenue: 7200, expenses: 3200 },
];

const clientsByPlan = [
  { plan: "Starter", count: 21 },
  { plan: "Pro", count: 12 },
  { plan: "Business", count: 4 },
  { plan: "Enterprise", count: 2 },
];

const sharesDistribution = [
  { name: "Ava", shares: 42 },
  { name: "Sophia", shares: 120 },
  { name: "Ethan", shares: 32 },
  { name: "Liam", shares: 5 },
  { name: "Mia", shares: 8 },
];



function currency(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function UserDashboard() {
  const totalClients = sampleUsers.length;
  const totalShares = sampleUsers.reduce((s, u) => s + u.shares, 0);
  const activePlans = new Set(sampleUsers.map((u) => u.plan)).size;
  const mrr = sampleUsers.reduce((s, u) => s + u.monthlySpend, 0);

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active customers on plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Files shared across network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distinct subscription tiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency(mrr)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recurring revenue (MRR)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finances Area Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Revenue and expenses over the last 6 months
              </CardDescription>
            </div>
            <Badge variant="outline">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={finances}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    name="Revenue"
                    dataKey="revenue"
                    stroke="#06B6D4"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    name="Expenses"
                    dataKey="expenses"
                    stroke="#EF4444"
                    fill="url(#colorExpenses)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clients By Plan Bar Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Clients by Plan</CardTitle>
            <CardDescription>
              Distribution of active subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientsByPlan}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="plan"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Users"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECONDARY CHARTS & TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Smaller Charts */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Shares Distribution</CardTitle>
              <CardDescription>Top users by share volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sharesDistribution}
                      dataKey="shares"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {sharesDistribution.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-blue-100 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Insights & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Upgrade candidates</div>
                  <Badge variant="default" className="bg-blue-600">
                    3 Users
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  Users nearing data limits. Reach out with automated upgrade
                  offers.
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Revenue churn risk</div>
                  <Badge variant="destructive">2 Users</Badge>
                </div>
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  Accounts marked as paused or inactive over the last 30 days.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: User Table */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>User Directory & Limits</CardTitle>
            <CardDescription>
              Detailed view of client status and data consumption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="w-50">Data Usage</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleUsers.map((u) => {
                  const usagePercentage = (u.dataUsedGB / u.dataLimitGB) * 100;
                  const isNearLimit = usagePercentage > 85;

                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{u.plan}</span>
                          <span className="text-xs text-muted-foreground">
                            {u.monthlySpend ? currency(u.monthlySpend) : "—"}/mo
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5 pr-4">
                          <div className="flex justify-between text-xs">
                            <span
                              className={
                                isNearLimit ? "text-red-600 font-medium" : ""
                              }
                            >
                              {u.dataUsedGB} GB
                            </span>
                            <span className="text-muted-foreground">
                              {u.dataLimitGB} GB
                            </span>
                          </div>
                          <Progress
                            value={usagePercentage}
                            className={`h-2 ${isNearLimit ? "[&>div]:bg-red-500" : ""}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{u.shares}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            u.status === "active"
                              ? "default"
                              : u.status === "trial"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
