"use client"

import { useState, useMemo } from "react"
import { IconCoins, IconUser, IconCheck, IconX } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Avatar,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui"
import { cn } from "@/lib/utils"
import { CoinIndicator } from "@/components/custom/CoinIndicator"

// Mock data - replace with actual data from your stores
const mockPolicies = [
  {
    id: "1",
    title: "Performance Bonus",
    description: "Monthly performance recognition",
    wermType: "gold" as const,
    defaultAmount: 50,
  },
  {
    id: "2", 
    title: "Attendance Reward",
    description: "Perfect attendance recognition",
    wermType: "silver" as const,
    defaultAmount: 25,
  },

]

const mockEmployees = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    department: "Engineering",
    avatarUrl: "",
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    email: "sarah@company.com",
    department: "Operations",
    avatarUrl: "",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@company.com", 
    department: "Design",
    avatarUrl: "",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@company.com",
    department: "Marketing",
    avatarUrl: "",
  },
]

interface GiveWermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GiveWermsDialog({ open, onOpenChange }: GiveWermsDialogProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("")
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set())
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const selectedPolicy = mockPolicies.find(p => p.id === selectedPolicyId)

  const distributionPreview = useMemo(() => {
    if (!selectedPolicy) return []
    
    return Array.from(selectedEmployees).map(employeeId => {
      const employee = mockEmployees.find(e => e.id === employeeId)
      const amount = customAmounts[employeeId] || selectedPolicy.defaultAmount
      
      return {
        employee,
        amount,
        wermType: selectedPolicy.wermType,
      }
    })
  }, [selectedEmployees, selectedPolicy, customAmounts])

  const totalWerms = distributionPreview.reduce((sum, item) => sum + item.amount, 0)

  function handleEmployeeToggle(employeeId: string) {
    const newSelected = new Set(selectedEmployees)
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId)
      // Remove custom amount when deselecting
      const newAmounts = { ...customAmounts }
      delete newAmounts[employeeId]
      setCustomAmounts(newAmounts)
    } else {
      newSelected.add(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  function handleAmountChange(employeeId: string, amount: string) {
    const numAmount = parseInt(amount) || 0
    setCustomAmounts(prev => ({
      ...prev,
      [employeeId]: numAmount,
    }))
  }

  async function handleDistribute() {
    if (!selectedPolicy || selectedEmployees.size === 0) return

    setIsLoading(true)
    
    try {
      // Here you would call your distribution API
      console.log("Distributing:", {
        policyId: selectedPolicy.id,
        distributions: distributionPreview,
        totalAmount: totalWerms,
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form and close dialog
      setSelectedPolicyId("")
      setSelectedEmployees(new Set())
      setCustomAmounts({})
      onOpenChange(false)
      
      // Show success toast (you can add toast notification here)
      
    } catch (error) {
      console.error("Distribution failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconCoins className="size-5 text-brand-500" />
            Distribute Werms
          </DialogTitle>
          <DialogDescription>
            Select a policy and employees to distribute werms to
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left Panel - Policy & Employee Selection */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Policy Selection */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="policy">Select Policy</Label>
              <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a distribution policy" />
                </SelectTrigger>
                <SelectContent>
                  {mockPolicies.map(policy => (
                    <SelectItem key={policy.id} value={policy.id}>
                      <div className="flex items-center gap-2">
                        <CoinIndicator value={policy.defaultAmount} type={policy.wermType} size="sm" />
                        <span>{policy.title}</span>
                        <span className="text-xs text-muted-foreground">
                          ({policy.defaultAmount} {policy.wermType} werms)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPolicy && (
                <p className="text-sm text-muted-foreground">
                  {selectedPolicy.description}
                </p>
              )}
            </div>

            {/* Employee Selection */}
            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
              <Label>Select Employees</Label>
              <div className="border rounded-lg flex-1 overflow-hidden flex flex-col">
                <div className="p-3 border-b bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployees.size} of {mockEmployees.length} employees selected
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {mockEmployees.map(employee => {
                    const isSelected = selectedEmployees.has(employee.id)
                    const customAmount = customAmounts[employee.id]
                    
                    return (
                      <div key={employee.id} className="p-3 border-b last:border-b-0 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleEmployeeToggle(employee.id)}
                            disabled={!selectedPolicy}
                          />
                          <Avatar className="size-8">
                            <div className="bg-muted flex items-center justify-center size-full">
                              <IconUser className="size-4" />
                            </div>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {employee.department} • {employee.email}
                            </p>
                          </div>
                          {isSelected && selectedPolicy && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={customAmount || selectedPolicy.defaultAmount}
                                onChange={(e) => handleAmountChange(employee.id, e.target.value)}
                                className="w-20 h-8"
                                min="1"
                              />
                              <CoinIndicator value={customAmount || selectedPolicy.defaultAmount} type={selectedPolicy.wermType} size="sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Distribution Preview */}
          <div className="w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Distribution Preview</h3>
              {totalWerms > 0 && (
                <Badge variant="outline">
                  Total: {totalWerms} werms
                </Badge>
              )}
            </div>

            <div className="border rounded-lg flex-1 overflow-hidden flex flex-col">
              {distributionPreview.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IconCoins className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select a policy and employees to preview distribution
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {distributionPreview.map(({ employee, amount, wermType }) => (
                    <div key={employee?.id} className="p-3 border-b last:border-b-0">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="size-6">
                            <div className="bg-muted flex items-center justify-center size-full">
                              <IconUser className="size-3" />
                            </div>
                          </Avatar>
                          <span className="text-sm font-medium truncate">
                            {employee?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{amount}</span>
                          <CoinIndicator value={amount} type={wermType} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isLoading}
              >
                <IconX className="mr-2 size-4" />
                Cancel
              </Button>
              <Button
                onClick={handleDistribute}
                disabled={!selectedPolicy || selectedEmployees.size === 0 || isLoading}
                className="flex-1"
              >
                <IconCheck className="mr-2 size-4" />
                Distribute
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 