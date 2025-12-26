"use client"

import { SearchBar } from "@upstash/search-ui"
import "@upstash/search-ui/dist/index.css"
import { Search } from "@upstash/search"
import { FileText } from "lucide-react"

const client = new Search({
  url: process.env.NEXT_PUBLIC_UPSTASH_SEARCH_URL || "",
  token: process.env.NEXT_PUBLIC_UPSTASH_SEARCH_READONLY_TOKEN || "",
})

const index = client.index<{ title: string }>("search_data")

export default function Page() {
  return (
    <div className="max-w-sm mt-24 mx-auto">
      <SearchBar.Dialog>
        <SearchBar.DialogTrigger placeholder="Search Anything..." />

        <SearchBar.DialogContent>
          <SearchBar.Input placeholder="Search Anything..." />
          <SearchBar.Results
            searchFn={(query) => {
              return index.search({ query, limit: 10, reranking: true })
            }}
          >
            {(result) => (
              <SearchBar.Result value={result.id} key={result.id}>
                <SearchBar.ResultIcon>
                  <FileText className="text-gray-600" />
                </SearchBar.ResultIcon>

                <SearchBar.ResultContent>
                  <SearchBar.ResultTitle>
                    {result.content.title}
                  </SearchBar.ResultTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Movie</p>
                </SearchBar.ResultContent>
              </SearchBar.Result>
            )}
          </SearchBar.Results>
        </SearchBar.DialogContent>
      </SearchBar.Dialog>
    </div>
  )
}
